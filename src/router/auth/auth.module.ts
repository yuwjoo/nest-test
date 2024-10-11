import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { Role } from 'src/entities/role.entity';
import { LoginRecord } from 'src/entities/login-record.entity';
import { AuthenticationModule } from 'src/feature-modules/authentication/authentication.module';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([User, Role, LoginRecord]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
