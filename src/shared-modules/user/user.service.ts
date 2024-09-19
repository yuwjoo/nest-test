import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRecord } from 'src/database/entities/login-record.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LoginRecord)
    private loginRecordRepository: Repository<LoginRecord>,
  ) {}

  /**
   * @description: 查找指定用户
   * @param {string} account 账号
   * @return {User} 用户数据
   */
  findOne(account: string): Promise<User> {
    return this.userRepository.findOne({
      relations: ['role', 'permissions', 'loginRecords'],
      where: { account },
    });
  }

  /**
   * @description: 添加登录记录
   * @param {User} user 用户
   * @param {string} token token
   * @return {Promise<LoginRecord>} 登录记录
   */
  addLoginRecord(user: User, token: string): Promise<LoginRecord> {
    return this.loginRecordRepository.save({ user, token });
  }
}
