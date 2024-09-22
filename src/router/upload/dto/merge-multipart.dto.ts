import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { MultipartDto } from './multipart.dto';

export class MergeMultipartDto {
  @ApiProperty({ description: '文件名', example: 'test.jpg' })
  @IsString({ message: 'name必须为字符串' })
  name: string;

  @ApiProperty({ description: '文件hash', example: 'f3b0c44298fc1c149af' })
  @IsString({ message: 'hash必须为字符串' })
  hash: string;

  @ApiProperty({
    description: '上传id',
    example: '60CEC7ECC095466B8783DAD17B225E2B',
  })
  @IsString({ message: 'uploadId必须为字符串' })
  uploadId: string;

  @ApiProperty({
    description: '分片集合',
    example: [
      { number: 1, etag: 'xxx' },
      { number: 2, etag: 'yyy' },
    ],
  })
  @ValidateNested({ message: '参数不合法' })
  parts: Pick<MultipartDto, 'number' | 'etag'>[];
}
