import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { LoginRecord } from './login-record.entity';

export enum UserStatus {
  enable = 'enable',
  disable = 'disable',
}

@Entity('user')
export class User {
  // 账号
  @PrimaryColumn({ name: 'account' })
  account: string;

  // 密码
  @Column({ name: 'password' })
  password: string;

  // 昵称
  @Column({ name: 'nickname' })
  nickname: string;

  // 头像
  @Column({ name: 'avatar', nullable: true, default: '' })
  avatar?: string;

  // 状态
  @Column({
    type: 'enum',
    name: 'status',
    enum: UserStatus,
    default: UserStatus.enable,
  })
  status: UserStatus;

  // 角色
  @ManyToOne(() => Role, (role) => role.name, { nullable: false })
  @JoinColumn({ name: 'role_name' })
  role: Role;

  // 权限集合
  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];

  // 登录记录集合
  @OneToMany(() => LoginRecord, (loginRecord) => loginRecord.user)
  loginRecords: LoginRecord[];

  // 存储起点
  @Column({ name: 'storage_origin' })
  storageOrigin: string;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  // 更新时间
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}
