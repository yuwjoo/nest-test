import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from 'src/database/entities/storage-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageFile])],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
