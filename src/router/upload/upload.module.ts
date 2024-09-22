import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OssFile } from 'src/database/entities/oss-file.entity';
import { OssModule } from 'src/shared-modules/oss/oss.module';

@Module({
  imports: [TypeOrmModule.forFeature([OssFile]), OssModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
