import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { AuthService } from './auth.service';
import { Role } from 'src/database/entities/role.entity';
import { LoginRecord } from 'src/database/entities/login-record.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([User, Role, LoginRecord]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
