import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { OssFile } from 'src/database/entities/oss-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageFile, OssFile])],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
