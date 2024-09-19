import { Entity, Column, PrimaryColumn, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('role')
export class Role {
  // 名称
  @PrimaryColumn({
    name: 'name',
  })
  name: string;

  // 描述
  @Column({
    name: 'describe',
    nullable: true,
  })
  describe?: string;

  // 权限集合
  @ManyToMany(() => Permission, (permission) => permission.id)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_name',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  permissions: Permission[];
}
