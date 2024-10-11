import { Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { RouterModule } from './router/router.module';
import { OssModule } from './shared-modules/oss/oss.module';
import { InterceptorModule } from './interceptor/interceptor.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    RouterModule,
    OssModule,
    InterceptorModule,
    AuthenticationModule,
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
