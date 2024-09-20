import { PageDataDto } from 'src/response/dto/page-data.dto';
import { FileDto } from '../dto/file-dto';
import { ApiProperty } from '@nestjs/swagger';

export class FileListVo extends PageDataDto {
  @ApiProperty({ description: '文件列表', type: [FileDto] })
  records: FileDto[];

  constructor(fileListVo?: FileListVo) {
    super();
    if (!fileListVo) return;

    this.records = fileListVo.records.map((item) => new FileDto(item));
  }
}
