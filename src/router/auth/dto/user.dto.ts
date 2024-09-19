import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from 'src/database/entities/user.entity';
import { RoleDto } from './role.dto';

export class UserDto {
  @ApiProperty({ description: '账号' })
  account: string;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @ApiProperty({ description: '头像', required: false })
  avatar?: string;

  @ApiProperty({ description: '状态', enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ description: '角色列表', type: [RoleDto] })
  roles: RoleDto[];

  @ApiProperty({ description: '存储起点' })
  storageOrigin: string;

  constructor(user: UserDto) {
    this.account = user.account;
    this.nickname = user.nickname;
    this.avatar = user.avatar;
    this.status = user.status;
    this.roles = user.roles.map((role) => new RoleDto(role));
    this.storageOrigin = user.storageOrigin;
  }
}
