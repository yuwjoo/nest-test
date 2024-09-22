import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetMultipartDto {
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
    type: [Number],
    description: '分片序号列表',
    example: [1, 2, 3],
  })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { each: true, message: 'partNumbers必须为数字列表' },
  )
  partNumbers: number[];
}
