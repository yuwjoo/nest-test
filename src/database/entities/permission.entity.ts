import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permission')
export class Permission {
  // 权限id
  @PrimaryGeneratedColumn()
  id: string;

  // 路径
  @Column({
    name: 'path',
  })
  path: string;

  // 层级
  @Column({
    name: 'level',
  })
  level: number;

  // 可读
  @Column({
    name: 'readable',
  })
  readable: boolean;

  // 可写
  @Column({
    name: 'writable',
  })
  writable: boolean;
}
