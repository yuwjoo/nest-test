import { Permission } from 'src/database/entities/permission.entity';
import { User } from 'src/database/entities/user.entity';

/**
 * @description: 文件名合法性校验
 * @param {string} text 文本
 * @return {boolean} 是否合法
 */
export function testFilename(text: string): boolean {
  return /^[^"*<>?\\|/:]+$/.test(text);
}

/**
 * @description: 获取存储权限
 * @param {User} user 用户信息
 * @param {string} path 存储路径
 * @return {Pick<Permission, 'readable' | 'writable'>} 存储权限
 */
export function getStoragePermission(
  user: User,
  path: string,
): Pick<Permission, 'readable' | 'writable'> {
  const match = (p: Permission) => (path + '/').startsWith(p.path);
  const defaultPermission: Pick<Permission, 'readable' | 'writable'> = {
    readable: false,
    writable: false,
  };
  return (
    user.permissions.find(match) ||
    user.role.permissions.find(match) ||
    defaultPermission
  );
}
