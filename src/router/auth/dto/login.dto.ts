import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '账号', example: 'yuwjoo' })
  account: string;

  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  constructor(loginDto: LoginDto) {
    if (!loginDto) return;

    this.account = loginDto.account;
    this.password = loginDto.password;
  }
}
