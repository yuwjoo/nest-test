import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsFilename } from 'src/common/is-filename.decorator';

export class ModifyDirectoryDto {
  @ApiProperty({ description: '父级路径', example: '/yuwjoo' })
  @IsString({ message: '父级路径必须为字符串' })
  parent: string;

  @ApiProperty({ description: '旧名称', example: 'utils' })
  @IsString({ message: '旧名称必须为字符串' })
  @IsFilename({ message: '旧名称不合法' })
  oldName: string;

  @ApiProperty({ description: '新名称', example: 'test' })
  @IsString({ message: '新名称必须为字符串' })
  @IsFilename({ message: '新名称不合法' })
  newName: string;
}
