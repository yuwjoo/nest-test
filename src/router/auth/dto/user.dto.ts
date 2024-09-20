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

  @ApiProperty({ description: '角色' })
  role: RoleDto;

  @ApiProperty({ description: '存储起点' })
  storageOrigin: string;

  constructor(user: UserDto) {
    if (!user) return;

    this.account = user.account;
    this.nickname = user.nickname;
    this.avatar = user.avatar;
    this.status = user.status;
    this.role = new RoleDto(user.role);
    this.storageOrigin = user.storageOrigin;
  }
}
