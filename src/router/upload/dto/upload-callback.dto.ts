import { ApiProperty } from '@nestjs/swagger';

export class UploadCallbackDto {
  @ApiProperty({ description: 'oss对象' })
  object: string;

  @ApiProperty({ description: '文件大小' })
  size: number;

  @ApiProperty({ description: '文件hash' })
  hash: string;

  @ApiProperty({ description: '账号' })
  account: string;
}
