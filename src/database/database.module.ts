import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginRecord } from './entities/login-record.entity';
import { OssFile } from './entities/oss-file.entity';
import { StorageFile, StorageFileType } from './entities/storage-file.entity';
import { DataSource, EntityManager } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        // sqlite连接配置
        // {
        //   type: 'sqlite',
        //   database: configService.get('databasePath'),
        //   enableWAL: true, // sqlite数据库加速
        //   entities: [
        //     User,
        //     Role,
        //     Permission,
        //     LoginRecord,
        //     OssFile,
        //     StorageFile,
        //     UserPermission,
        //   ], // 显式导入实体
        //   synchronize: true, // 根据实体自动更新数据库（生产环境会造成数据丢失）
        //   // autoLoadEntities: true, // 自动加载实体
        // }
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'cloud_disk',
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
export class DatabaseModule {
  constructor(private readonly entityManager: EntityManager) {
    // this.init();
  }

  /**
   * @description: 初始化数据库
   */
  async init() {
    await this.entityManager.save(Role, [
      {
        name: 'admin',
        describe: '管理员',
      },
      {
        name: 'user',
        describe: '普通用户',
      },
    ]); // 初始化角色

    const permissions = await this.entityManager.save(Permission, [
      {
        role: { name: 'user' },
        path: '/public/',
        priority: 100025,
        readable: true,
        writable: true,
      },
      {
        role: { name: 'admin' },
        path: '/',
        priority: 100010,
        readable: true,
        writable: true,
      },
      {
        path: '/admin/',
        priority: 200025,
        readable: true,
        writable: true,
      },
    ]); // 初始化权限

    await this.entityManager.save(User, {
      account: 'admin',
      password: '123456',
      nickname: '管理员',
      role: { name: 'admin' },
      permissions: [permissions.find((p) => p.path === '/admin/')],
      storageOrigin: '/',
    }); // 初始化管理员

    await this.entityManager.save(StorageFile, [
      {
        path: '/',
        parent: '',
        depth: 0,
        name: '',
        type: StorageFileType.directory,
      },
      {
        path: '/public',
        parent: '/',
        depth: 1,
        name: 'public',
        type: StorageFileType.directory,
      },
      {
        path: '/admin',
        parent: '/',
        depth: 1,
        name: 'admin',
        type: StorageFileType.directory,
      },
    ]); // 初始化存储
  }
}
