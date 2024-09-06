/*
 * @FileName: 守卫-用户认证
 * @FilePath: \test\src\guard\auth.ts
 * @Author: YH
 * @Date: 2024-09-06 16:59:16
 * @LastEditors: YH
 * @LastEditTime: 2024-09-06 17:03:12
 * @Description:
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return !!request;
  }
}
