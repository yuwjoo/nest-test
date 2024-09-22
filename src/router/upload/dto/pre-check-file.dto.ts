import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PreCheckFileDto {
  @ApiProperty({ description: '文件名', example: 'test.jpg' })
  @IsString({ message: 'name必须为字符串' })
  name: string;

  @ApiProperty({ description: '文件hash', example: 'f3b0c44298fc1c149af' })
  @IsString({ message: 'hash必须为字符串' })
  hash: string;

  @ApiProperty({ description: '文件大小', example: 8451 })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'size必须为数字' })
  size: number;

  @ApiProperty({ description: '文件类型', example: 'image/jpeg' })
  @IsString({ message: 'mimeType必须为字符串' })
  mimeType: string;

  @ApiProperty({ description: '是否分片上传', required: false })
  @IsBoolean({ message: 'multipart必须为布尔值' })
  multipart: boolean = false;
}
