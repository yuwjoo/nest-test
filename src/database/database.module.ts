import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginRecord } from './entities/login-record.entity';
import { OssFile } from './entities/oss-file.entity';
import { StorageFile } from './entities/storage-file.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: configService.get('databasePath'),
          enableWAL: true, // sqlite数据库加速
          entities: [User, Role, Permission, LoginRecord, OssFile, StorageFile], // 显式导入实体
          synchronize: true, // 根据实体自动更新数据库（生产环境会造成数据丢失）
          // autoLoadEntities: true, // 自动加载实体
        };
      },
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
  ],
})
export class DatabaseModule {}
