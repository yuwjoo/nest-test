import { Module } from '@nestjs/common';
import { FileSystemController } from './fileSystem.controller';

@Module({
  controllers: [FileSystemController],
  providers: [],
})
export class FileSystemModule {}
