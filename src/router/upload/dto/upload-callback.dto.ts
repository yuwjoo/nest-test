import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UploadCallbackDto {
  @ApiProperty({ description: 'oss对象' })
  @IsString({ message: 'object必为字符串' })
  object: string;

  @ApiProperty({ description: '文件大小' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'size必须为整数' })
  size: number;

  @ApiProperty({ description: '文件hash' })
  @IsString({ message: 'hash必为字符串' })
  hash: string;

  @ApiProperty({ description: '账号' })
  @IsString({ message: 'account必为字符串' })
  account: string;
}
