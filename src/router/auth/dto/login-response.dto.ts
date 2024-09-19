import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class LoginResponseDto {
  @ApiProperty({ description: 'token' })
  token: string;

  @ApiProperty({ description: '用户信息' })
  user: UserDto;

  constructor(loginResponse: LoginResponseDto) {
    this.token = loginResponse.token;
    this.user = new UserDto(loginResponse.user);
  }
}
