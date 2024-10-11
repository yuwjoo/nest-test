import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { DefaultConfig } from './configuration.interface';

// 默认配置工厂
export const defaultConfigFactory = registerAs<DefaultConfig>('default', () => {
  return <any>yaml.load(readFileSync(join(__dirname, './config.yml'), 'utf8'));
});
