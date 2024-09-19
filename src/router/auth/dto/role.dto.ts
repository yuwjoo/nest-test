import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '描述', required: false })
  describe?: string;

  constructor(role: RoleDto) {
    this.name = role.name;
    this.describe = role.describe;
  }
}
