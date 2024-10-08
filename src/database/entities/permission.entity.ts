import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 用户
  @ManyToOne(() => User, (user) => user.account)
  @JoinColumn({ name: 'user_account' })
  user: User;

  // 角色
  @ManyToOne(() => Role, (role) => role.name)
  @JoinColumn({ name: 'role_name' })
  role: Role;

  // 路径
  @Column({ name: 'path' })
  path: string;

  // 优先级
  @Column({ name: 'priority' })
  priority: number;

  // 可读
  @Column({ name: 'readable' })
  readable: boolean;

  // 可写
  @Column({ name: 'writable' })
  writable: boolean;

  constructor(data: Partial<Permission>) {
    Object.assign(this, data);
  }
}
