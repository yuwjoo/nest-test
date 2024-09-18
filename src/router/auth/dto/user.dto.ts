import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from 'src/database/entities/user.entity';
import { RoleDto } from './role.dto';

export class UserDto {
  @ApiProperty({
    description: '账号',
    example: 'yuwjoo',
  })
  account: string;

  @ApiProperty({
    description: '昵称',
    example: 'YH',
  })
  nickname: string;

  @ApiProperty({
    description: '头像',
    example: 'http://xxx.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: '状态',
    enum: UserStatus,
    example: 'enable',
  })
  status: UserStatus;

  @ApiProperty({
    description: '角色列表',
    type: [RoleDto],
  })
  roles: RoleDto[];

  @ApiProperty({
    description: '存储起点',
  })
  storageOrigin: string;
}
