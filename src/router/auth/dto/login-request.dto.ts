import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ description: '账号', example: 'yuwjoo' })
  account: string;

  @ApiProperty({ description: '密码', example: '123456' })
  password: string;
}
