import { Module } from '@nestjs/common';
import { AuthModule as FunAuthModule } from 'src/auth/auth.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { AuthService } from './auth.service';
import { Permission } from 'src/database/entities/permission.entity';

@Module({
  imports: [FunAuthModule, TypeOrmModule.forFeature([User, Permission])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
