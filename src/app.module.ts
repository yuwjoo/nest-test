import { Module, NestModule } from '@nestjs/common';
import { AuthenticationModule } from './feature-modules/authentication/authentication.module';
import { ConfigurationModule } from './feature-modules/configuration/configuration.module';
import { DatabaseModule } from './feature-modules/database/database.module';
import { InterceptorModule } from './feature-modules/interceptor/interceptor.module';
import { RouterModule } from './router/router.module';

@Module({
  imports: [
    AuthenticationModule,
    ConfigurationModule,
    DatabaseModule,
    InterceptorModule,
    RouterModule,
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
