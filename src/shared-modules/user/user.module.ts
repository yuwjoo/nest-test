import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { LoginRecord } from 'src/database/entities/login-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LoginRecord])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
