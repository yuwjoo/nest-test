import { DEFAULT_CONFIG } from 'src/common/constants';
import { defaultConfigFactory } from './configuration.config';
import { ConfigType } from '@nestjs/config';

// 默认配置提供者
export const defaultConfigProvider = {
  provide: DEFAULT_CONFIG,
  inject: [defaultConfigFactory.KEY],
  useFactory: (config: ConfigType<typeof defaultConfigFactory>) => {
    return config;
  },
};
