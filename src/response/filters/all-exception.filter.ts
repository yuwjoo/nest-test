import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { createResponse } from '../response';
import { RESPONSE_CODE, RESPONSE_MSG } from '../types/response.enum';

/**
 * @description: 全局异常过滤器
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(_exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const data = createResponse(
      undefined,
      RESPONSE_MSG.SERVER_ERROR,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
  }
}
