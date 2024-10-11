import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { initSwaggerModule } from './swagger/swagger';
import { DEFAULT_CONFIG } from './common/constants';
import { DefaultConfig } from './configuration/configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const config = app.get<DefaultConfig>(DEFAULT_CONFIG);
  app.enableCors(); // 跨域设置
  app.setGlobalPrefix('api'); // 设置全局前缀
  app.useStaticAssets('public', { prefix: '/static' }); // 静态资源服务
  initSwaggerModule(app); // 初始化swagger模块
  await app.listen(config.server.port);
}

bootstrap();
