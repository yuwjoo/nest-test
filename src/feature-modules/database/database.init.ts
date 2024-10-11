import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { StorageFile, StorageFileType } from 'src/entities/storage-file.entity';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';

/**
 * @description: 初始化数据库
 */
export async function initDatabase(entityManager: EntityManager) {
  await entityManager.save(Role, [
    {
      name: 'admin',
      describe: '管理员',
    },
    {
      name: 'user',
      describe: '普通用户',
    },
  ]); // 初始化角色

  const permissions = await entityManager.save(Permission, [
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

  await entityManager.save(User, {
    account: 'admin',
    password: '123456',
    nickname: '管理员',
    role: { name: 'admin' },
    permissions: [permissions.find((p) => p.path === '/admin/')],
    storageOrigin: '/',
  }); // 初始化管理员

  await entityManager.save(StorageFile, [
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
