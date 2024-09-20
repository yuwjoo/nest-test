import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IsFilename } from 'src/common/is-filename.decorator';

export class CreateFileDto {
  @ApiProperty({ description: '父级路径', example: '/yuwjoo' })
  @IsString({ message: '父级路径必须为字符串' })
  parent: string;

  @ApiProperty({ description: '名称', example: 'utils' })
  @IsString({ message: '名称必须为字符串' })
  @IsFilename({ message: '名称不合法' })
  name: string;

  @ApiProperty({ description: '是否文件夹', example: true })
  @IsBoolean({ message: '名称必须为布尔值' })
  isDirectory: boolean;

  @ApiProperty({ description: 'oss文件id', example: '' })
  @IsOptional()
  @IsString({ message: 'oss文件id必须为字符串' })
  ossFileId?: string;
}
