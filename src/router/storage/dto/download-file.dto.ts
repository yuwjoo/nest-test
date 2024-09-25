import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DownloadFileDto {
  @ApiProperty({ description: '路径', example: '/yuwjoo/test' })
  @IsString({ message: 'path必须为字符串' })
  path: string;
}
