import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsFilename } from 'src/common/is-filename.decorator';

export class RegisterDto {
  @ApiProperty({ description: '账号', example: 'yuwjoo' })
  @IsFilename({ message: '账号不合法' })
  account: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString({ message: '密码必须为字符串' })
  @Length(6, 20, { message: '密码长度限制为6-20位' })
  password: string;

  @ApiProperty({ description: '昵称', example: 'YH' })
  @IsString({ message: '昵称必须为字符串' })
  nickname: string;

  constructor(register: RegisterDto) {
    if (!register) return;

    this.account = register.account;
    this.password = register.password;
    this.nickname = register.nickname;
  }
}
