import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BatchDeleteFileDto {
  @ApiProperty({ description: '路径列表', example: ['/yuwjoo/test'] })
  @IsString({ message: 'path必须为字符串数组', each: true })
  paths: string[];
}
