import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ description: '路径' })
  path: string;

  @ApiProperty({ description: '父级' })
  parent: string;

  @ApiProperty({ description: '层级' })
  level: number;

  @ApiProperty({ description: '大小' })
  size: number;

  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '是否文件夹' })
  isDirectory: boolean;

  @ApiProperty({ description: '创建时间戳' })
  createdTime: number;

  @ApiProperty({ description: '更新时间戳' })
  updatedTime: number;

  @ApiProperty({ description: '可读' })
  readable: boolean;

  @ApiProperty({ description: '可写' })
  writable: boolean;
}
