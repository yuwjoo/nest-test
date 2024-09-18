import {
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('login_ecord')
export class LoginRecord {
  // token
  @PrimaryColumn({
    name: 'token',
  })
  token: string;

  // 用户账号
  @ManyToOne(() => User, (user) => user.account)
  @JoinColumn({
    name: 'user_account',
  })
  user: User;

  // 创建时间
  @CreateDateColumn({
    name: 'create_date',
  })
  createDate: Date;
}
