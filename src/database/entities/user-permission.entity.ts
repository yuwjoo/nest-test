import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('user_permission')
export class UserPermission {
  // 用户账号
  @PrimaryColumn({ name: 'user_account' })
  @ManyToOne(() => User, (user) => user.account)
  @JoinColumn({ name: 'user_account', referencedColumnName: 'account' })
  userAccount: string;

  // 权限id
  @PrimaryColumn({ name: 'permission_id' })
  @ManyToOne(() => Permission, (permission) => permission.id)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permissionId: string;
}
