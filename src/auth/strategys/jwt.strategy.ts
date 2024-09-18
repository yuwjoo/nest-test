import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/database/entities/user.entity';
import { CustomJwtPayload } from '../types/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求对象的何处获取token
      ignoreExpiration: false, // 拦截过期的token
      secretOrKey: configService.get<string>('secretKeyBase64'), // 加密密钥
      passReqToCallback: true, // 请求对象加入到校验回调参数中
    });
  }

  /**
   * @description: token校验
   * @param {CustomJwtPayload} payload 负载
   * @return {User} 用户信息
   */
  async validate(request: Request, payload: CustomJwtPayload): Promise<User> {
    const user = await this.authService.validateJWT(
      ExtractJwt.fromAuthHeaderAsBearerToken()(request),
      payload.account,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
