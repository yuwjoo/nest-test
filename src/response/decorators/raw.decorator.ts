import { SetMetadata } from '@nestjs/common';

export const IS_RAW_KEY = Symbol('isRaw');

/**
 * @description: 使用原始响应数据（全局拦截器不做处理）
 */
export const Raw = () => SetMetadata(IS_RAW_KEY, true);
