import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { defaultConfig } from './configuration.config';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [defaultConfig], cache: true })],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
