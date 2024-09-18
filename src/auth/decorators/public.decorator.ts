import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = Symbol('isPublic');

/**
 * @description: 接口是否公开（不需要身份认证）
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
