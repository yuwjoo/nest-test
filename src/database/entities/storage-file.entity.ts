import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OssFile } from './oss-file.entity';
import { User } from './user.entity';

export enum StorageFileType {
  file = 'file',
  directory = 'directory',
}

@Entity('storage_file')
export class StorageFile {
  // 路径
  @PrimaryColumn({ name: 'path' })
  path: string;

  // 父级
  @Column({ name: 'parent' })
  parent: string;

  // 名称
  @Column({ name: 'name' })
  name: string;

  // 深度
  @Column({ name: 'depth' })
  depth: number;

  // 类型
  @Column({ name: 'type', type: 'enum', enum: StorageFileType })
  type: StorageFileType;

  // 大小
  @Column({ name: 'size', default: '' })
  size: number;

  // oss文件
  @ManyToOne(() => OssFile, (ossFile) => ossFile.id)
  @JoinColumn({ name: 'oss_file_id' })
  ossFile?: OssFile;

  // 创建者
  @ManyToOne(() => User, (user) => user.account, { nullable: false })
  @JoinColumn({ name: 'creator' })
  user: User;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  createdDate: Date;

  // 更新时间
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  // 删除时间
  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate: Date;
}
