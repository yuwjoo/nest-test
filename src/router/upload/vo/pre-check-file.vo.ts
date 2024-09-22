import { ApiProperty } from '@nestjs/swagger';

export enum MODE {
  SECOND = 'second',
  SIMPLE = 'simple',
  MULTIPART = 'multipart',
}

export class PreCheckFileVo {
  @ApiProperty({
    description: '模式：second-秒传，simple-简单上传，multipart-分片上传',
    enum: MODE,
  })
  mode: MODE;

  @ApiProperty({
    description:
      '可能是（秒传：已上传文件id）（简单上传：上传url）（分片上传：上传id）',
  })
  value: string;

  @ApiProperty({ description: '过期时间戳' })
  expire: number;

  constructor(mode: MODE, value: string, expire: number) {
    this.mode = mode;
    this.value = value;
    this.expire = expire;
  }
}
