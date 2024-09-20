import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ description: '路径' })
  path: string;

  @ApiProperty({ description: '父级' })
  parent: string;

  @ApiProperty({ description: '层级' })
  level: number;

  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '是否文件夹' })
  isDirectory: boolean;

  @ApiProperty({ description: '创建时间' })
  createdDate: string;

  @ApiProperty({ description: '更新时间' })
  updatedDate: string;

  constructor(fileDto?: FileDto) {
    if (!fileDto) return;

    this.path = fileDto.path;
    this.level = fileDto.level;
    this.name = fileDto.name;
    this.isDirectory = fileDto.isDirectory;
    this.createdDate = fileDto.createdDate;
    this.updatedDate = fileDto.updatedDate;
  }
}
