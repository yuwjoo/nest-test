import { BadRequestException, Injectable } from '@nestjs/common';
import { FileListDto } from './dto/file-list-dto';
import { getStoragePermission } from 'src/utils/common';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { Repository } from 'typeorm';
import { FileListVo } from './vo/file-list.vo';
import { CreateFileDto } from './dto/create-file.dto';
import { OssFile } from 'src/database/entities/oss-file.entity';
import { CreateFileVo } from './vo/create-file.vo';
import { RenameFileDto } from './dto/rename-file.dto';
import { RenameFileVo } from './vo/rename-file.vo';
import { DeleteFileDto } from './dto/delete-file.dto';
import { MoveFileDto } from './dto/move-file.dto';
import { MoveFileVo } from './vo/move-file.vo';
import { OssService } from 'src/shared-modules/oss/oss.service';
import { UserService } from 'src/shared-modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { GetFileCoverDto } from './dto/get-file-cover.dto';
import { BatchDeleteFileDto } from './dto/batch-delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(StorageFile)
    private readonly storageFileRepository: Repository<StorageFile>,
    @InjectRepository(OssFile)
    private readonly ossFileRepository: Repository<OssFile>,
    private readonly ossService: OssService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description: 获取列表
   * @param {User} user 用户信息
   * @param {FileListDto} fileListDto 参数
   * @return {Promise<FileListVo>} 列表
   */
  async list(user: User, fileListDto: FileListDto): Promise<FileListVo> {
    const fileList = await this.storageFileRepository.find({
      where: {
        parent: fileListDto.parent,
      },
    });

    return new FileListVo(user, fileList);
  }

  /**
   * @description: 创建目录/文件
   * @param {User} user 用户信息
   * @param {CreateFileDto} createFileDto 参数
   * @return {Promise<CreateFileVo>} 文件信息
   */
  async create(
    user: User,
    createFileDto: CreateFileDto,
  ): Promise<CreateFileVo> {
    const filePath = createFileDto.parent + '/' + createFileDto.name;
    const storagePermission = getStoragePermission(user, createFileDto.parent);

    if (!storagePermission.writable) {
      throw new BadRequestException('无权限访问');
    }

    if (
      !(await this.storageFileRepository.exists({
        where: { path: createFileDto.parent },
      }))
    ) {
      throw new BadRequestException('父级目录不存在');
    }

    if (
      await this.storageFileRepository.exists({
        where: { path: filePath },
      })
    ) {
      throw new BadRequestException('已存在同名文件');
    }

    if (!createFileDto.isDirectory && !createFileDto.ossFileId) {
      throw new BadRequestException('创建文件需要关联oss文件');
    }

    let ossFile: OssFile | undefined;

    if (createFileDto.ossFileId) {
      ossFile = await this.ossFileRepository.findOne({
        where: {
          id: createFileDto.ossFileId,
        },
      });

      if (!ossFile) {
        throw new BadRequestException('oss文件不存在');
      }
    }

    const storageFile = await this.storageFileRepository.save({
      path: filePath,
      parent: createFileDto.parent,
      level: filePath.split('/').length,
      size: ossFile?.size || 0,
      name: createFileDto.name,
      isDirectory: createFileDto.isDirectory,
      ossFile,
    });

    return new CreateFileVo(storageFile, storagePermission);
  }

  /**
   * @description: 重命名目录/文件
   * @param {User} user 用户信息
   * @param {RenameFileDto} renameFileDto 参数
   * @return {Promise<RenameFileVo>} 文件信息
   */
  async rename(
    user: User,
    renameFileDto: RenameFileDto,
  ): Promise<RenameFileVo> {
    const oldFilePath = renameFileDto.parent + '/' + renameFileDto.oldName;
    const newFilePath = renameFileDto.parent + '/' + renameFileDto.newName;
    const storagePermission = getStoragePermission(user, renameFileDto.parent);

    if (!storagePermission.writable) {
      throw new BadRequestException('无权限访问');
    }

    try {
      await this.storageFileRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager
            .createQueryBuilder()
            .update(StorageFile)
            .set({ path: newFilePath, name: renameFileDto.newName })
            .where('path = :path', { path: oldFilePath })
            .execute();

          await transactionalEntityManager
            .createQueryBuilder()
            .update(StorageFile)
            .set({
              path: () => `REPLACE(path, '${oldFilePath}', '${newFilePath}')`,
              parent: () =>
                `REPLACE(parent, '${oldFilePath}', '${newFilePath}')`,
            })
            .where('parent = :parent OR parent LIKE :parentLike', {
              parent: oldFilePath,
              parentLike: `${oldFilePath}/%`,
            })
            .execute();
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new BadRequestException('重命名失败');
    }

    const storageFile = await this.storageFileRepository.findOne({
      where: { path: newFilePath },
    });

    return new RenameFileVo(storageFile, storagePermission);
  }

  /**
   * @description: 移动目录/文件
   * @param {User} user 用户信息
   * @param {MoveFileDto} moveFileDto 参数
   * @return {Promise<MoveFileVo>} 文件信息
   */
  async move(user: User, moveFileDto: MoveFileDto): Promise<MoveFileVo> {
    const oldFilePath = moveFileDto.oldParent + '/' + moveFileDto.name;
    const newFilePath = moveFileDto.newParent + '/' + moveFileDto.name;
    const oldPermission = getStoragePermission(user, moveFileDto.oldParent);
    const newPermission = getStoragePermission(user, moveFileDto.newParent);

    if (!oldPermission.writable || !newPermission.writable) {
      throw new BadRequestException('无权限访问');
    }

    try {
      await this.storageFileRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager
            .createQueryBuilder()
            .update(StorageFile)
            .set({ path: newFilePath, parent: moveFileDto.newParent })
            .where('path = :path', { path: oldFilePath })
            .execute();

          await transactionalEntityManager
            .createQueryBuilder()
            .update(StorageFile)
            .set({
              path: () => `REPLACE(path, '${oldFilePath}', '${newFilePath}')`,
              parent: () =>
                `REPLACE(parent, '${oldFilePath}', '${newFilePath}')`,
            })
            .where('parent = :parent OR parent LIKE :parentLike', {
              parent: oldFilePath,
              parentLike: `${oldFilePath}/%`,
            })
            .execute();
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new BadRequestException('移动失败');
    }

    const storageFile = await this.storageFileRepository.findOne({
      where: { path: newFilePath },
    });

    return new MoveFileVo(storageFile, newPermission);
  }

  /**
   * @description: 删除目录/文件
   * @param {User} user 用户信息
   * @param {DeleteFileDto} deleteFileDto 参数
   */
  async delete(user: User, deleteFileDto: DeleteFileDto) {
    const parent = deleteFileDto.path.split('/').slice(0, -1).join('/');
    const storagePermission = getStoragePermission(user, parent);

    if (!storagePermission.writable) {
      throw new BadRequestException('无权限访问');
    }

    await this.storageFileRepository
      .createQueryBuilder()
      .delete()
      .from(StorageFile)
      .where('path = :path OR path LIKE :pathLike', {
        path: deleteFileDto.path,
        pathLike: `${deleteFileDto.path}/%`,
      })
      .execute();
  }

  /**
   * @description: 批量删除目录/文件
   * @param {User} user 用户信息
   * @param {BatchDeleteFileDto} batchDeleteFileDto 参数
   */
  async batchDelete(user: User, batchDeleteFileDto: BatchDeleteFileDto) {
    await Promise.all(
      batchDeleteFileDto.paths.map((path) => this.delete(user, { path })),
    );
  }

  /**
   * @description: 获取文件封面
   * @param {GetFileCoverDto} getFileCoverDto 参数
   * @return {Promise<string>} 签名url
   */
  async getFileCover(getFileCoverDto: GetFileCoverDto): Promise<string> {
    let account: string;

    try {
      account = await this.jwtService.verify(getFileCoverDto.token).account;
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    const user = await this.userService.findOne(account);

    const permission = getStoragePermission(user, getFileCoverDto.path);

    if (!permission.readable) {
      throw new BadRequestException('无权限访问');
    }

    const storageFile = await this.storageFileRepository.findOne({
      relations: ['ossFile'],
      where: { path: getFileCoverDto.path },
    });

    if (!storageFile.ossFile) {
      throw new BadRequestException('未找到oss资源');
    }

    return this.ossService.admin.signatureUrl(storageFile.ossFile.object, {
      expires: 60,
      process: 'image/resize,w_80',
    });
  }

  /**
   * @description: 下载文件
   * @param {DownloadFileDto} downloadFileDto 参数
   * @return {Promise<string>} 签名url
   */
  async downloadFile(
    user: User,
    downloadFileDto: DownloadFileDto,
  ): Promise<string> {
    const permission = getStoragePermission(user, downloadFileDto.path);

    if (!permission.readable) {
      throw new BadRequestException('无权限访问');
    }

    const storageFile = await this.storageFileRepository.findOne({
      relations: ['ossFile'],
      where: { path: downloadFileDto.path },
    });

    if (!storageFile.ossFile) {
      throw new BadRequestException('未找到oss资源');
    }

    return this.ossService.signDownloadUrl(
      storageFile.ossFile.object,
      storageFile.name,
    );
  }
}
