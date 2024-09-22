import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { PreCheckFileDto } from './dto/pre-check-file.dto';
import { GetMultipartDto } from './dto/get-multiparts.dto';
import { MergeMultipartDto } from './dto/merge-multipart.dto';
import { GetMultipartsVo } from './vo/get-multiparts.vo';
import { MODE, PreCheckFileVo } from './vo/pre-check-file.vo';
import { InjectRepository } from '@nestjs/typeorm';
import { OssFile } from 'src/database/entities/oss-file.entity';
import { Repository } from 'typeorm';
import { OssService } from 'src/shared-modules/oss/oss.service';
import { UploadCallbackDto } from './dto/upload-callback.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(OssFile)
    private readonly ossFileRepository: Repository<OssFile>,
    private readonly ossService: OssService,
  ) {}

  /**
   * @description: 预检查文件
   * @return {Promise<PreCheckFileVo>} 信息
   */
  async preCheckFile(
    user: User,
    preCheckFileDto: PreCheckFileDto,
  ): Promise<PreCheckFileVo> {
    const ossFile = await this.ossFileRepository.findOne({
      where: { hash: preCheckFileDto.hash, size: preCheckFileDto.size },
    });

    if (ossFile) {
      return new PreCheckFileVo(MODE.SECOND, ossFile.id, 0);
    }

    const object = this.ossService.generateObject(
      user,
      preCheckFileDto.hash,
      preCheckFileDto.name,
    );

    if (preCheckFileDto.multipart) {
      const { uploadId } = await this.ossService.admin.initMultipartUpload(
        object,
        { mime: preCheckFileDto.mimeType },
      );
      return new PreCheckFileVo(MODE.MULTIPART, uploadId, 0);
    } else {
      const { url, expire } = await this.ossService.signSimpleUploadUrl(
        user,
        object,
        preCheckFileDto.hash,
        preCheckFileDto.mimeType,
      );
      return new PreCheckFileVo(MODE.SIMPLE, url, expire);
    }
  }

  /**
   * @description: 获取分片集合
   * @return {Promise<GetMultipartsVo[]>} 分片集合
   */
  async getMultiparts(
    user: User,
    getMultipartDto: GetMultipartDto,
  ): Promise<GetMultipartsVo[]> {
    const object = this.ossService.generateObject(
      user,
      getMultipartDto.hash,
      getMultipartDto.name,
    );
    return await Promise.all(
      getMultipartDto.partNumbers.map<Promise<GetMultipartsVo>>(
        async (partNumber) => {
          const { url, expire } = await this.ossService.signMultiPartUploadUrl(
            object,
            getMultipartDto.uploadId,
            partNumber,
          );
          return new GetMultipartsVo({ number: partNumber, url, expire });
        },
      ),
    );
  }

  /**
   * @description: 合并上传的分片
   * @return {Promise<string>} 上传文件id
   */
  async mergeMultipart(
    user: User,
    mergeMultipartDto: MergeMultipartDto,
  ): Promise<string> {
    const object = this.ossService.generateObject(
      user,
      mergeMultipartDto.hash,
      mergeMultipartDto.name,
    );
    try {
      return await this.ossService.mergeMultipartUpload(
        user,
        object,
        mergeMultipartDto.hash,
        mergeMultipartDto.uploadId,
        mergeMultipartDto.parts,
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /**
   * @description: 上传回调
   */
  async callback(uploadCallbackDto: UploadCallbackDto) {
    console.log(uploadCallbackDto);
  }
}
