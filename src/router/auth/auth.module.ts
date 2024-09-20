import { Module } from '@nestjs/common';
import { AuthModule as FunAuthModule } from 'src/auth/auth.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { AuthService } from './auth.service';
import { Role } from 'src/database/entities/role.entity';
import { LoginRecord } from 'src/database/entities/login-record.entity';

@Module({
  imports: [FunAuthModule, TypeOrmModule.forFeature([User, Role, LoginRecord])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
