import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRecord } from 'src/database/entities/login-record.entity';
import { User } from 'src/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService as FunAuthService } from 'src/auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { Permission } from 'src/database/entities/permission.entity';
import { Role } from 'src/database/entities/role.entity';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { LoginVo } from './vo/login.vo';

@Injectable()
export class AuthService {
  constructor(
    private readonly authService: FunAuthService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(LoginRecord)
    private readonly loginRecordRepository: Repository<LoginRecord>,
  ) {}

  /**
   * @description: 注册
   * @param {RegisterDto} registerDto 注册信息
   */
  async register(registerDto: RegisterDto) {
    const oldUser = await this.userRepository.findOne({
      where: { account: registerDto.account },
    });

    if (oldUser) {
      throw new BadRequestException('该账号已被注册');
    }

    const rootPath = '/' + registerDto.account;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(StorageFile, {
        path: rootPath,
        parent: '/',
        level: 2,
        name: registerDto.account,
        isDirectory: true,
      });
      const permission = await manager.save(Permission, {
        path: rootPath,
        level: 2,
        readable: true,
        writable: true,
      });
      await manager.save(User, {
        account: registerDto.account,
        nickname: registerDto.nickname,
        password: registerDto.password,
        role: this.roleRepository.create({ name: 'user' }),
        permissions: [permission],
        storageOrigin: rootPath,
      });
    });
  }

  /**
   * @description: 登录
   * @param {User} user 用户信息
   * @return {Promise<LoginVo>} 登录信息
   */
  async login(user: User): Promise<LoginVo> {
    const token = this.authService.generateToken(user);

    await this.dataSource.transaction(async (manager) => {
      if (user.loginRecords.length > 5) {
        manager.delete(LoginRecord, user.loginRecords[0].token);
      }
      manager.save(LoginRecord, { user, token });
    });

    return new LoginVo({ user, token });
  }

  /**
   * @description: 登出
   * @param {string} token token
   */
  async logout(token: string) {
    await this.loginRecordRepository.delete({ token });
  }
}
