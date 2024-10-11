import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * @description: 全局校验管道工厂函数
 */
export const validationPipeFactory = () => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    stopAtFirstError: true,
    exceptionFactory: (errors: ValidationError[]) => {
      return new BadRequestException(
        Object.values(errors[0]?.constraints || {})[0] || '参数不合法！',
      );
    },
  });
};
