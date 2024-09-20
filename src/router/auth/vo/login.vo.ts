import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';

export class LoginVo {
  @ApiProperty({ description: 'token' })
  token: string;

  @ApiProperty({ description: '用户信息' })
  user: UserDto;

  constructor(loginVo?: LoginVo) {
    if (!loginVo) return;

    this.token = loginVo.token;
    this.user = new UserDto(loginVo.user);
  }
}
