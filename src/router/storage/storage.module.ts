import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from 'src/entities/storage-file.entity';
import { OssFile } from 'src/entities/oss-file.entity';
import { OssModule } from 'src/shared-modules/oss/oss.module';
import { UserModule } from 'src/shared-modules/user/user.module';
import { AuthenticationModule } from 'src/feature-modules/authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile, OssFile]),
    OssModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
