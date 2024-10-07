import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('role')
export class Role {
  // 名称
  @PrimaryColumn({ name: 'name' })
  name: string;

  // 描述
  @Column({ name: 'describe', nullable: true })
  describe?: string;

  // 权限集合
  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];
}
