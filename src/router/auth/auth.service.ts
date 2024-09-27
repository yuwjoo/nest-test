import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRecord } from 'src/database/entities/login-record.entity';
import { User } from 'src/database/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { AuthService as FunAuthService } from 'src/auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { LoginVo } from './vo/login.vo';
import { Permission } from 'src/database/entities/permission.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authService: FunAuthService,
    private readonly entityManager: EntityManager,
    @InjectRepository(LoginRecord)
    private readonly loginRecordRepository: Repository<LoginRecord>,
  ) {}

  /**
   * @description: 注册
   * @param {RegisterDto} registerDto 注册信息
   */
  async register(registerDto: RegisterDto) {
    const userPath = '/' + registerDto.account;

    await this.entityManager.transaction(async (manager) => {
      const userExists = await manager.exists(User, {
        where: { account: registerDto.account },
      });
      if (userExists) {
        throw new BadRequestException('该账号已被注册');
      }

      try {
        const permission = await manager.save(Permission, {
          path: userPath,
          level: 2,
          readable: true,
          writable: true,
        }); // 创建权限

        await manager.save(User, {
          account: registerDto.account,
          nickname: registerDto.nickname,
          password: registerDto.password,
          role: { name: 'user' },
          permissions: [permission],
          storageOrigin: userPath,
        }); // 创建用户

        await manager.save(StorageFile, {
          path: userPath,
          parent: '/',
          level: 2,
          name: registerDto.account,
          isDirectory: true,
        }); // 创建存储目录
      } catch {
        throw new BadRequestException('注册失败');
      }
    });
  }

  /**
   * @description: 登录
   * @param {User} user 用户信息
   * @return {Promise<LoginVo>} 登录信息
   */
  async login(user: User): Promise<LoginVo> {
    const token = this.authService.generateToken(user);

    await this.entityManager.transaction(async (manager) => {
      if (user.loginRecords.length > 5) {
        manager.delete(LoginRecord, user.loginRecords[0].token);
      }
      manager.save(LoginRecord, { user, token });
    });

    return new LoginVo(token, user);
  }

  /**
   * @description: 登出
   * @param {string} token token
   */
  async logout(token: string) {
    await this.loginRecordRepository.delete({ token });
  }
}
