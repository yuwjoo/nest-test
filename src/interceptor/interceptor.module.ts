import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { GlobalExceptionsFilter } from './filters/global-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { validationPipeFactory } from './pipes/validationPipeFactory';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: validationPipeFactory,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class InterceptorModule {}
