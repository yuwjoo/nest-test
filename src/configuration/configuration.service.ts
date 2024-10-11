import { Inject, Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from 'src/common/constants';
import { DefaultConfig } from './configuration.interface';

@Injectable()
export class ConfigurationService {
  constructor(@Inject(DEFAULT_CONFIG) private readonly config: DefaultConfig) {}
}
