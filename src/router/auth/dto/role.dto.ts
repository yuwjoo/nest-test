import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    description: '名称',
    example: 'user',
  })
  name: string;

  @ApiProperty({
    description: '描述',
    example: '普通用户',
  })
  describe?: string;
}
