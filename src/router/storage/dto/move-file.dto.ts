import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsFilename } from 'src/common/is-filename.decorator';

export class MoveFileDto {
  @ApiProperty({ description: '名称', example: 'utils' })
  @IsString({ message: '名称必须为字符串' })
  @IsFilename({ message: '名称不合法' })
  name: string;

  @ApiProperty({ description: '旧父级路径', example: '/yuwjoo/test' })
  @IsString({ message: '旧父级路径必须为字符串' })
  oldParent: string;

  @ApiProperty({ description: '新父级路径', example: '/yuwjoo/aaa' })
  @IsString({ message: '新父级路径必须为字符串' })
  newParent: string;
}
