import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileListDto {
  @ApiProperty({ description: '路径', example: '/yuwjoo' })
  @IsString({ message: '路径必须为字符串' })
  path: string;

  constructor(fileListDto?: FileListDto) {
    if (!fileListDto) return;

    this.path = fileListDto.path;
  }
}
