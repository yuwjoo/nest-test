import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { DatabaseService } from './database.service';
import { DEFAULT_CONFIG } from 'src/common/constants';
import { Permission } from 'src/entities/permission.entity';
import { LoginRecord } from 'src/entities/login-record.entity';
import { OssFile } from 'src/entities/oss-file.entity';
import { Role } from 'src/entities/role.entity';
import { StorageFile } from 'src/entities/storage-file.entity';
import { User } from 'src/entities/user.entity';
import { DefaultConfig } from 'src/interfaces/configuration.interface';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DEFAULT_CONFIG],
      useFactory: (config: DefaultConfig) => {
        return {
          type: 'mysql',
          host: config.database.mysql.host,
          port: config.database.mysql.port,
          username: config.database.mysql.username,
          password: config.database.mysql.password,
          database: config.database.mysql.database,
          entities: [User, Role, Permission, LoginRecord, OssFile, StorageFile], // 显式导入实体
          synchronize: config.env === 'development', // 根据实体自动更新数据库（会造成数据丢失, 生产环境禁用）
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
