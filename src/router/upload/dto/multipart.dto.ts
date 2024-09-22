import { ApiProperty } from '@nestjs/swagger';

export class MultipartDto {
  @ApiProperty({ description: '分片序号' })
  number: number;

  @ApiProperty({ description: '上传地址' })
  url: string;

  @ApiProperty({ description: '过期时间戳' })
  expire: number;

  @ApiProperty({ description: 'etag' })
  etag: string;
}
