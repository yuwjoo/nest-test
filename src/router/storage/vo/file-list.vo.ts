import { PageDataDto } from 'src/response/dto/page-data.dto';
import { FileDto } from '../dto/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { User } from 'src/database/entities/user.entity';
import { getStoragePermission } from 'src/utils/common';

export class FileListVo extends PageDataDto {
  @ApiProperty({ description: '文件列表', type: [FileDto] })
  records: FileDto[];

  constructor(user: User, storageFiles: StorageFile[]) {
    super();

    const list: FileDto[] = [];

    storageFiles.forEach((file) => {
      const permission = getStoragePermission(user, file.path);

      if (permission.readable) {
        list.push({
          path: file.path,
          parent: file.parent,
          depth: file.depth,
          size: file.size,
          name: file.name,
          type: file.type,
          createdTime: file.createdDate.getTime(),
          updatedTime: file.updatedDate.getTime(),
          readable: permission.readable,
          writable: permission.writable,
        });
      }
    });

    this.current = 1;
    this.size = list.length;
    this.total = list.length;
    this.records = list;
  }
}
