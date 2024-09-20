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

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(StorageFile)
    private readonly storageFileRepository: Repository<StorageFile>,
  ) {}

  /**
   * @description: 获取列表
   * @param {User} user 用户信息
   * @param {FileListDto} fileListDto 参数
   * @return {Promise<FileListVo>} 列表
   */
  async list(user: User, fileListDto: FileListDto): Promise<FileListVo> {
    const storagePermission = getStoragePermission(user, fileListDto.path);

    if (!storagePermission.readable) {
      throw new BadRequestException('无权限访问');
    }

    const fileList = await this.storageFileRepository.find({
      relations: ['ossFile'],
      where: {
        parent: fileListDto.path,
      },
    });

    return new FileListVo(fileList);
  }

  /**
   * @description: 创建目录/文件
   * @param {User} user 用户信息
   * @param {CreateFileDto} createFileDto 参数
   */
  async create(user: User, createFileDto: CreateFileDto) {
    const filePath = createFileDto.parent + '/' + createFileDto.name;
    const storagePermission = getStoragePermission(user, createFileDto.parent);

    if (!storagePermission.writable) {
      throw new BadRequestException('无权限访问');
    }

    const existParent = await this.storageFileRepository.exists({
      where: {
        path: createFileDto.parent,
      },
    });

    if (!existParent) {
      throw new BadRequestException('父级目录不存在');
    }

    const exist = await this.storageFileRepository.exists({
      where: {
        path: filePath,
      },
    });

    if (exist) {
      throw new BadRequestException('已存在同名文件');
    }

    let ossFile: OssFile | undefined;

    if (createFileDto.ossFileId) {
      ossFile = new OssFile();
      ossFile.id = createFileDto.ossFileId;
    }

    await this.storageFileRepository.save({
      path: filePath,
      parent: createFileDto.parent,
      level: filePath.split('/').length,
      name: createFileDto.name,
      isDirectory: createFileDto.isDirectory,
      ossFile,
    });
  }

  /**
   * @description: 修改目录
   * @param {User} user 用户信息
   * @param {CreateFileDto} createDirectoryDto 参数
   */
  async modifyDirectory(user: User, createDirectoryDto: CreateFileDto) {
    const path = createDirectoryDto.parent + '/' + createDirectoryDto.name;
    const storagePermission = getStoragePermission(
      user,
      createDirectoryDto.parent,
    );

    if (!storagePermission.writable) {
      throw new BadRequestException('无权限访问');
    }

    const existParent = await this.storageFileRepository.exists({
      where: {
        path: createDirectoryDto.parent,
      },
    });

    if (!existParent) {
      throw new BadRequestException('父级目录不存在');
    }

    const existDirectory = await this.storageFileRepository.exists({
      where: { path },
    });

    if (existDirectory) {
      throw new BadRequestException('已存在同名目录');
    }

    await this.storageFileRepository.save({
      path,
      parent: createDirectoryDto.parent,
      level: path.split('/').length,
      name: createDirectoryDto.name,
      isDirectory: true,
    });
  }
}
