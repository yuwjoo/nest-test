import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginRecord } from './entities/login-record.entity';
import { OssFile } from './entities/oss-file.entity';
import { StorageFile } from './entities/storage-file.entity';
import { DataSource, EntityManager } from 'typeorm';
import { DatabaseService } from './database.service';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => {
        return {
          type: 'mysql',
          host: configService.config.database.mysql.host,
          port: configService.config.database.mysql.port,
          username: configService.config.database.mysql.username,
          password: configService.config.database.mysql.password,
          database: configService.config.database.mysql.database,
          entities: [User, Role, Permission, LoginRecord, OssFile, StorageFile], // 显式导入实体
          synchronize: configService.config.env === 'development', // 根据实体自动更新数据库（会造成数据丢失, 生产环境禁用）
        };
      },
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  constructor(private readonly entityManager: EntityManager) {
    // initDatabase(this.entityManager);
  }
}
