import { Module } from '@nestjs/common';
import { AuthModule as FunAuthModule } from 'src/auth/auth.module';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/shared-modules/user/user.module';

@Module({
  imports: [FunAuthModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
