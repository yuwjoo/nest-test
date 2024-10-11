import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description: 获取请求对象中的token
 */
export const GetToken = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.token;
  },
);
