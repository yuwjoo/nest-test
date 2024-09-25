import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { OssFile } from 'src/database/entities/oss-file.entity';
import { OssModule } from 'src/shared-modules/oss/oss.module';
import { UserModule } from 'src/shared-modules/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile, OssFile]),
    OssModule,
    UserModule,
    AuthModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
