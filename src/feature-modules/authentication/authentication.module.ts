import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DEFAULT_CONFIG } from 'src/common/constants';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserModule } from 'src/shared-modules/user/user.module';
import { JwtStrategy } from './strategys/jwt.strategy';
import { LocalStrategy } from './strategys/local.strategy';
import { DefaultConfig } from 'src/interfaces/configuration.interface';

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
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
