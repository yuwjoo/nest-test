import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  createCommonResponse,
  RESPONSE_CODE,
  RESPONSE_MSG,
} from 'src/common/response';

/**
 * @description: 全局异常过滤器
 */
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const data = createCommonResponse(
      undefined,
      RESPONSE_MSG.SERVER_ERROR,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);

    throw exception;
  }
}
