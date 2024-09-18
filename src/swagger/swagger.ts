import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PageDataDto } from 'src/response/dto/page-data.dto';
import { ResponseDto } from 'src/response/dto/response.dto';

/**
 * @description: 初始化swagger模块
 * @param {NestExpressApplication} app 应用实例
 */
export function initSwaggerModule(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('API 文档')
    .setDescription('这是一个nestJS的API文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ResponseDto, PageDataDto],
  });
  SwaggerModule.setup('docs', app, document);
}
