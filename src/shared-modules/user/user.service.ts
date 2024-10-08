import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @description: 查找指定用户
   * @param {string} account 账号
   * @return {User} 用户数据
   */
  findOne(account: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'rolePermission')
      .leftJoinAndSelect('user.permissions', 'userPermission')
      .leftJoinAndSelect('user.loginRecords', 'userLoginRecord')
      .where('user.account = :account', { account })
      .orderBy({
        'userPermission.priority': 'DESC',
        'rolePermission.priority': 'DESC',
      })
      .getOne();
  }
}
