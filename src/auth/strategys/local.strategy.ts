import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  /**
   * @description: 用户校验
   * @param {string} account 账号
   * @param {string} password 密码
   * @return {Promise<User>} 用户信息
   */
  async validate(account: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(account, password);
    if (!user) {
      throw new BadRequestException('账号或密码错误');
    }
    return user;
  }
}
