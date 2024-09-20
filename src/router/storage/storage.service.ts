import { BadRequestException, Injectable } from '@nestjs/common';
import { FileListDto } from './dto/file-list-dto';
import { getStoragePermission } from 'src/utils/common';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { Repository } from 'typeorm';
import { FileListVo } from './vo/file-list.vo';

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
      where: {
        parent: fileListDto.path,
      },
    });

    return new FileListVo(fileList);
  }
}
