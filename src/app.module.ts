import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CORSMiddleware } from './middleware/cors';
import { ConfigModule } from '@nestjs/config';
import { FileSystemModule } from './resource/fileSystem/fileSystem.module';
import { OssModule } from './resource/oss/oss.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    FileSystemModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CORSMiddleware).forRoutes('*');
  }
}
