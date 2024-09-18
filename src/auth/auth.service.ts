import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/shared-modules/user/user.service';
import { CustomJwtPayload } from './types/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * @description: 校验用户
   * @param {string} account 账号
   * @param {string} pass 密码
   * @return {Promise<User | null>} 用户信息
   */
  async validateUser(account: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne(account);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  /**
   * @description: 生成Token
   * @param {User} user 用户信息
   * @return {string} token
   */
  generateToken(user: User): string {
    const payload: CustomJwtPayload = { account: user.account };
    return this.jwtService.sign(payload);
  }

  /**
   * @description: 校验JWT
   * @param {string} token token
   * @param {string} account 账号
   * @return {Promise<User | null>} 用户信息
   */
  async validateJWT(token: string, account: string): Promise<User | null> {
    const user = await this.userService.findOne(account);
    const available = user.loginRecords.find(
      (record) => record.token === token,
    );
    return available ? user : null;
  }
}
