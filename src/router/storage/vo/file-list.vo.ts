import { PageDataDto } from 'src/response/dto/page-data.dto';
import { FileDto } from '../dto/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { StorageFile } from 'src/database/entities/storage-file.entity';

export class FileListVo extends PageDataDto {
  @ApiProperty({ description: '文件列表', type: [FileDto] })
  records: FileDto[];

  constructor(storageFile: StorageFile[]) {
    super();

    this.current = 1;
    this.size = storageFile.length;
    this.total = storageFile.length;
    this.records = storageFile.map<FileDto>((item) => {
      return {
        path: item.path,
        parent: item.parent,
        level: item.level,
        name: item.name,
        isDirectory: item.isDirectory,
        createdTime: item.createdDate.getTime(),
        updatedTime: item.updatedDate.getTime(),
      };
    });
  }
}
