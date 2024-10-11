import { SetMetadata } from '@nestjs/common';
import { IS_RAW_KEY } from 'src/common/constants';

/**
 * @description: 是否响应原始数据
 */
export const Raw = () => SetMetadata(IS_RAW_KEY, true);
