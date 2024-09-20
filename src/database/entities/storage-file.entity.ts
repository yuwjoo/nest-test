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

@Entity('storage_file')
export class StorageFile {
  // 路径
  @PrimaryColumn({
    name: 'path',
  })
  path: string;

  // 父级
  @Column({
    name: 'parent',
  })
  parent: string;

  // 层级
  @Column({
    name: 'level',
  })
  level: number;

  // 名称
  @Column({
    name: 'name',
  })
  name: string;

  // 是否目录
  @Column({
    name: 'is_directory',
  })
  isDirectory: boolean;

  // 大小
  @Column({
    name: 'size',
    default: 0,
  })
  size: number;

  // 关联的oss文件
  @ManyToOne(() => OssFile)
  @JoinColumn({ name: 'oss_file_id' })
  ossFile?: OssFile;

  // 创建时间
  @CreateDateColumn({
    name: 'create_date',
  })
  createdDate: Date;

  // 更新时间
  @UpdateDateColumn({
    name: 'updated_date',
  })
  updatedDate: Date;

  // 删除时间
  @DeleteDateColumn({
    name: 'deleted_date',
  })
  deletedDate: Date;
}
