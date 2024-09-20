import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';
import { User } from 'src/database/entities/user.entity';

export class LoginVo {
  @ApiProperty({ description: 'token' })
  token: string;

  @ApiProperty({ description: '用户信息' })
  user: UserDto;

  constructor(token: string, user: User) {
    this.token = token;
    this.user = {
      account: user.account,
      nickname: user.nickname,
      status: user.status,
      role: {
        name: user.role.name,
        describe: user.role.describe,
      },
      storageOrigin: user.storageOrigin,
    };
  }
}
