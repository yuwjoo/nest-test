import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import {
  createCommonResponse,
  RESPONSE_CODE,
  RESPONSE_MSG,
} from 'src/common/response';
import { IS_RAW_KEY } from 'src/common/constants';

/**
 * @description: 响应拦截器
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
      return createCommonResponse(data, RESPONSE_MSG.SUCCESS, RESPONSE_CODE.OK);
    };

    return next.handle().pipe(map(handleMap));
  }
}
