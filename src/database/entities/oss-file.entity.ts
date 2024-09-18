import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StorageFile } from './storage-file.entity';

@Entity('oss_file')
export class OssFile {
  // id
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // hash
  @Column({
    name: 'hash',
  })
  hash: string;

  // 大小
  @Column({
    name: 'size',
    default: 0,
  })
  size: number;

  // 名称
  @Column({
    name: 'name',
  })
  name: string;

  // object
  @Column({
    name: 'object',
  })
  object: string;

  // 上传者
  @Column({
    name: 'uploader',
  })
  uploader: string;

  // 存储文件集合
  @OneToMany(() => StorageFile, (storageFile) => storageFile.ossFile)
  storageFiles: StorageFile[];

  // 创建时间
  @CreateDateColumn({
    name: 'create_date',
  })
  createDate: Date;

  // 更新时间
  @UpdateDateColumn({
    name: 'updated_date',
  })
  updatedDate: Date;
}
