import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { CustomJwtPayload } from '../types/jwt';
import { AuthService } from '../auth.service';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求对象的何处获取token
      ignoreExpiration: false, // 拦截过期的token
      secretOrKey: configService.config.secretKeyBase64, // 加密密钥
      passReqToCallback: true, // 请求对象加入到校验回调参数中
    });
  }

  /**
   * @description: token校验
   * @param {CustomJwtPayload} payload 负载
   * @return {User} 用户信息
   */
  async validate(request: Request, payload: CustomJwtPayload): Promise<User> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const user = await this.authService.validateJWT(token, payload.account);
    if (!user) {
      throw new UnauthorizedException();
    }
    request['token'] = token; // 将token添加到请求对象中
    return user;
  }
}
