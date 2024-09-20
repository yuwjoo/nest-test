import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { initResponseModule } from './response/response';
import { initSwaggerModule } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(); // 跨域设置
  app.setGlobalPrefix('api'); // 设置全局前缀
  app.useStaticAssets('public', { prefix: '/static' }); // 静态资源服务
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(
          Object.values(errors[0].constraints)[0] || '参数不合法！',
        );
      },
    }),
  ); // 全局校验管道
  initResponseModule(app); // 初始化响应模块
  initSwaggerModule(app); // 初始化swagger模块
  await app.listen(3000);
}

bootstrap();
