import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetFileCoverDto {
  @ApiProperty({ description: 'token', example: 'xxxxxxxxxxxxxxxxx' })
  @IsString({ message: 'token必须为字符串' })
  token: string;

  @ApiProperty({ description: '文件路径', example: '/yuwjoo/test.jpg' })
  @IsString({ message: 'path必须为字符串' })
  path: string;
}
