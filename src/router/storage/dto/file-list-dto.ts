import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileListDto {
  @ApiProperty({ description: '父级路径', example: '/yuwjoo' })
  @IsString({ message: '父级路径必须为字符串' })
  parent: string;
}
