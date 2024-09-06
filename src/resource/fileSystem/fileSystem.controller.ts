import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('fileSystem')
export class FileSystemController {
  constructor(private configService: ConfigService) {}

  @Get('getDirectoryList')
  getDirectoryList(): string {
    const dbUser = this.configService.get<string>('host');
    console.log(dbUser);
    return dbUser;
  }
}
