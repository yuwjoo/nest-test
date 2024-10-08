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
  const defaultPermission: Pick<Permission, 'readable' | 'writable'> = {
    readable: false,
    writable: false,
  };
  const match = (p: Permission) => {
    const pos = p.path.endsWith('/') ? p.path.length - 1 : p.path.length;
    return path.startsWith(p.path) && (path.slice(pos, pos + 1) || '/') === '/';
  };

  return (
    user.permissions.find(match) ||
    user.role.permissions.find(match) ||
    defaultPermission
  );
}

/**
 * @description: 连接文件路径
 * @param {string[]} paths 路径集合
 * @param {boolean} endSlash 是否斜杠结尾
 * @return {string} 路径字符串
 */
export function joinFilePath(paths: string[], endSlash?: boolean): string {
  const text = ('/' + paths.filter(Boolean).join('/')).replace(/\/{2,}/g, '/');
  return endSlash ? (text + '/').replace('//', '/') : text.replace(/\/$/, '');
}

/**
 * @description: 获取路径深度
 * @param {string} path 路径
 * @return {number} 深度
 */
export function getFileDepth(path: string): number {
  return path.split('/').filter(Boolean).length;
}
