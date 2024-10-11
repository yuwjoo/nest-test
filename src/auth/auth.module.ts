import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import { UserModule } from 'src/shared-modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { DEFAULT_CONFIG } from 'src/common/constants';
import { DefaultConfig } from 'src/configuration/configuration.interface';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [DEFAULT_CONFIG],
      useFactory: async (config: DefaultConfig) => ({
        secret: config.secretKeyBase64, // 加密密钥
        signOptions: {
          expiresIn: config.tokenExpirationTime, // 过期时间
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
