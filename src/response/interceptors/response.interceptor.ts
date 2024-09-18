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

/**
 * @description: 全局响应拦截器
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const handleMap = (data: any) => {
      return createResponse(data, RESPONSE_MSG.SUCCESS, RESPONSE_CODE.OK);
    };

    return next.handle().pipe(map(handleMap));
  }
}
