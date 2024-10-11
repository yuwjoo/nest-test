import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/common/constants';

/**
 * @description: 接口是否公开（不需要身份认证）
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
