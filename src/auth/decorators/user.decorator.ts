import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description: 获取请求对象中的user数据
 */
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
