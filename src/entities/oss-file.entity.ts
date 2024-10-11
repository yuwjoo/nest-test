import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StorageFile } from './storage-file.entity';
import { User } from './user.entity';

@Entity('oss_file')
export class OssFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // hash
  @Column({ name: 'hash' })
  hash: string;

  // 大小
  @Column({ name: 'size', default: 0 })
  size: number;

  // object
  @Column({ name: 'object' })
  object: string;

  // 上传者
  @ManyToOne(() => User, (user) => user.account, { nullable: false })
  @JoinColumn({ name: 'uploader_account' })
  uploader: User;

  // 存储文件集合
  @OneToMany(() => StorageFile, (storageFile) => storageFile.ossFile)
  storageFiles: StorageFile[];

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  // 更新时间
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  constructor(data: Partial<OssFile>) {
    Object.assign(this, data);
  }
}
