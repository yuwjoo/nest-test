import { Inject, Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from 'src/common/constants';
import { DefaultConfig } from 'src/interfaces/configuration.interface';

@Injectable()
export class ConfigurationService {
  constructor(@Inject(DEFAULT_CONFIG) private readonly config: DefaultConfig) {}
}
