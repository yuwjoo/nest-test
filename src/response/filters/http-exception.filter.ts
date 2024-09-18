import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { createResponse } from '../response';

/**
 * @description: Http异常过滤器
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const data = createResponse(
      undefined,
      (exception.getResponse() as any)?.message || exception.message,
      exception.getStatus(),
    );

    response.status(HttpStatus.OK).json(data);
  }
}
