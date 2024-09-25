import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_CODE, RESPONSE_MSG } from '../types/response.enum';
import { createResponse } from '../response';
import { Reflector } from '@nestjs/core';
import { IS_RAW_KEY } from '../decorators/raw.decorator';

/**
 * @description: 全局响应拦截器
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isRaw = this.reflector.getAllAndOverride<boolean>(IS_RAW_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const handleMap = (data: any) => {
      if (isRaw) {
        return data;
      }
      return createResponse(data, RESPONSE_MSG.SUCCESS, RESPONSE_CODE.OK);
    };

    return next.handle().pipe(map(handleMap));
  }
}
