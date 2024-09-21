import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [AuthModule, StorageModule, UploadModule],
})
export class RouterModule {}
