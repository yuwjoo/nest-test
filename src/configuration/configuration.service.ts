import { Inject, Injectable } from '@nestjs/common';
import { defaultConfig } from './configuration.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(
    @Inject(defaultConfig.KEY)
    readonly config: ConfigType<typeof defaultConfig>,
  ) {}
}
