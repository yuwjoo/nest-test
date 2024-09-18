import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Configuration } from './types/configuration';

const YAML_CONFIG_FILENAME = './configs/config.yml';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          return yaml.load(
            readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
          ) as Configuration;
        },
      ],
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class ConfigurationModule {}
