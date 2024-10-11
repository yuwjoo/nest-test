import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { defaultConfigFactory } from './configuration.config';
import { defaultConfigProvider } from './configuration.provider';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ load: [defaultConfigFactory], cache: true }),
  ],
  providers: [ConfigurationService, defaultConfigProvider],
  exports: [ConfigurationService, defaultConfigProvider],
})
export class ConfigurationModule {}
