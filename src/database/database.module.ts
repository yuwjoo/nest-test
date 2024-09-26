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
import { UserPermission } from './entities/user-permission.entity';

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
          entities: [
            User,
            Role,
            Permission,
            LoginRecord,
            OssFile,
            StorageFile,
            UserPermission,
          ], // 显式导入实体
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
export class DatabaseModule {
  constructor(private readonly dataSource: DataSource) {
    // this.init();
  }

  /**
   * @description: 初始化数据库
   */
  async init() {
    await this.dataSource.manager.save(StorageFile, [
      {
        path: '/',
        parent: '',
        level: 1,
        name: '/',
        isDirectory: true,
      },
      {
        path: '/public',
        parent: '/',
        level: 2,
        name: 'public',
        isDirectory: true,
      },
      {
        path: '/admin',
        parent: '/',
        level: 2,
        name: 'admin',
        isDirectory: true,
      },
    ]);
    const permissions = await this.dataSource.manager.save(Permission, [
      {
        path: '/',
        level: 1,
        readable: true,
        writable: true,
      },
      {
        path: '/public',
        level: 2,
        readable: true,
        writable: true,
      },
      {
        path: '/admin',
        level: 2,
        readable: true,
        writable: true,
      },
    ]);
    const roles = await this.dataSource.manager.save(Role, [
      {
        name: 'admin',
        describe: '管理员',
        permissions: permissions.filter((p) => p.path === '/'),
      },
      {
        name: 'user',
        describe: '普通用户',
        permissions: permissions.filter((p) => p.path === '/public'),
      },
    ]);
    await this.dataSource.manager.save(User, {
      account: 'admin',
      password: '123456',
      nickname: '管理员',
      role: roles.find((role) => role.name === 'admin'),
      permissions: permissions.filter((p) => p.path === '/admin'),
      storageOrigin: '/',
    });
  }
}
