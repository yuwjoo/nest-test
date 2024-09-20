import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteFileDto {
  @ApiProperty({ description: '路径', example: '/yuwjoo/test' })
  @IsString({ message: '路径必须为字符串' })
  path: string;
}
