import { Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { RouterModule } from './router/router.module';
import { OssModule } from './shared-modules/oss/oss.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    AuthModule,
    RouterModule,
    OssModule,
    ResponseModule,
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
