import { BadRequestException, Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { OSSExtend, SingUrlInfo } from './types/oss.interface';
import { User } from 'src/database/entities/user.entity';
import { MultipartDto } from 'src/router/upload/dto/multipart.dto';
import { Request } from 'express';
import { verifyUploadCallback } from './utils/verify-upload-callback';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class OssService {
  public readonly admin: OSSExtend; // admin账号
  private readonly uploadSignExpire: number; // 上传签名有效期
  private readonly uploadSignRule: Record<string, any>; // 上传签名规则

  constructor(private readonly configService: ConfigurationService) {
    this.admin = this.initAdmin();
    this.uploadSignExpire = this.configService.config.oss.uploadSignExpire;
    this.uploadSignRule = {
      'x-oss-forbid-overwrite': true, // 禁止覆盖
      'x-oss-object-acl': 'private', // 私有
      'x-oss-storage-class': 'Standard', // 标准存储
    };
  }

  /**
   * @description: 初始化Admin账号
   * @return {OSSExtend} oss
   */
  initAdmin(): OSSExtend {
    return new OSS({
      region: this.configService.config.oss.region,
      accessKeyId: this.configService.config.oss.adminAccessKeyID,
      accessKeySecret: this.configService.config.oss.adminAccessKeySecret,
      bucket: this.configService.config.oss.bucketName,
    }) as OSSExtend;
  }

  /**
   * @description: 签名下载url
   * @param {string} object oss对象
   * @param {string} name 文件名称
   * @return {Promise<string>} 签名url
   */
  async signDownloadUrl(object: string, name: string): Promise<string> {
    return this.admin.signatureUrl(object, {
      expires: this.configService.config.oss.downloadSignExpire, // 签名url过期时间（秒）
      response: {
        'content-disposition': `attachment; filename=${encodeURIComponent(name)}`, // 下载文件名
      },
    });
  }

  /**
   * @description: 签名简单上传url
   * @param {User} user 用户
   * @param {string} object oss对象
   * @param {string} hash 文件hash
   * @param {string} mime 文件mime
   * @return {Promise<SingUrlInfo>} url信息
   */
  async signSimpleUploadUrl(
    user: User,
    object: string,
    hash: string,
    mime: string,
  ): Promise<SingUrlInfo> {
    const url = await this.admin.signatureUrlV4(
      'PUT',
      this.uploadSignExpire,
      {
        headers: { 'Content-Type': mime, ...this.uploadSignRule },
        queries: this.generateUploadCallback(user, hash),
      },
      object,
    );

    return { url, expire: Date.now() + this.uploadSignExpire * 1000 };
  }

  /**
   * @description: 签名分片上传url
   * @param {string} object oss对象
   * @param {string} uploadId 分片上传id
   * @param {number} partNumber 分片号
   * @return {Promise<SingUrlInfo>} url信息
   */
  async signMultiPartUploadUrl(
    object: string,
    uploadId: string,
    partNumber: number,
  ): Promise<SingUrlInfo> {
    const url = await this.admin.signatureUrlV4(
      'PUT',
      this.uploadSignExpire,
      {
        headers: { 'Content-Type': 'application/octet-stream' },
        queries: { partNumber, uploadId },
      },
      object,
    );
    return { url, expire: Date.now() + this.uploadSignExpire * 1000 };
  }

  /**
   * @description: 合并分片上传
   * @param {User} user 用户
   * @param {string} object oss对象
   * @param {string} hash 文件hash
   * @param {string} uploadId 分片上传id
   * @param {Pick<MultipartDto, 'number' | 'etag'>[]} parts 分片信息
   * @return {Promise<any>} 合并结果
   */
  async mergeMultipartUpload(
    user: User,
    object: string,
    hash: string,
    uploadId: string,
    parts: Pick<MultipartDto, 'number' | 'etag'>[],
  ): Promise<any> {
    const response = await this.admin.completeMultipartUpload(
      object,
      uploadId,
      parts,
      {
        headers: { ...this.uploadSignRule },
        callback: {
          url: this.configService.config.oss.uploadCallbackUrl,
          body: 'object=${object}&size=${size}&hash=${x:hash}&account=${x:account}',
          contentType: 'application/x-www-form-urlencoded',
          customValue: { hash, account: user.account },
        },
      },
    );

    return (response.data as unknown as any).data;
  }

  /**
   * @description: 生成上传回调参数
   * @param {User} user 用户
   * @param {string} hash 文件hash
   * @return {Record<string, any>} 回调参数
   */
  generateUploadCallback(user: User, hash: string): Record<string, any> {
    const callback = {
      callbackUrl: this.configService.config.oss.uploadCallbackUrl,
      callbackBody:
        'object=${object}&size=${size}&hash=${x:hash}&account=${x:account}',
      callbackBodyType: 'application/x-www-form-urlencoded',
    };
    const callbackVar = {
      'x:hash': hash,
      'x:account': user.account,
    };

    return {
      callback: btoa(JSON.stringify(callback)),
      'callback-var': btoa(JSON.stringify(callbackVar)),
    };
  }

  /**
   * @description: 生成object
   * @param {User} user 用户
   * @param {string} hash 文件hash
   * @param {string} name 文件名
   * @return {string} object
   */
  generateObject(user: User, hash: string, name: string): string {
    return `storage/${user.account}/${hash}-${name}`;
  }

  /**
   * @description: 校验上传回调
   * @param {Request} req express请求对象
   */
  async verifyCallback(req: Request) {
    try {
      await verifyUploadCallback(req, this.configService.config.oss.bucketName);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
