import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRecord } from 'src/database/entities/login-record.entity';
import { User } from 'src/database/entities/user.entity';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
  TypeORMError,
} from 'typeorm';
import { AuthService as FunAuthService } from 'src/auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { Permission } from 'src/database/entities/permission.entity';
import { Role } from 'src/database/entities/role.entity';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { LoginVo } from './vo/login.vo';
import { CONSTRAINT } from 'sqlite3';
import { UserPermission } from 'src/database/entities/user-permission.entity';

let num = 0;

@Injectable()
export class AuthService {
  constructor(
    private readonly authService: FunAuthService,
    private readonly entityManager: EntityManager,
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
    const userPath = '/' + registerDto.account;
    const index = num++;

    console.log(
      'user',
      index,
      await this.entityManager.findOne(User, {
        where: { account: registerDto.account },
      }),
    );

    try {
      console.time();
      // await this.entityManager.transaction(async (manager) => {

      const userInsertResult = await this.entityManager.insert(User, {
        account: registerDto.account,
        nickname: registerDto.nickname,
        password: registerDto.password,
        role: { name: 'user' },
        storageOrigin: userPath,
      }); // 创建用户

      const permissionInsertResult = await this.entityManager.insert(
        Permission,
        {
          path: userPath,
          level: 2,
          readable: true,
          writable: true,
        },
      ); // 创建用户权限

      // console.log('aaaa', index, permissionInsertResult.identifiers);

      await this.entityManager.insert(UserPermission, {
        userAccount: userInsertResult.identifiers[0].account,
        permissionId: permissionInsertResult.identifiers[0].id,
      }); // 关联用户和权限

      // await manager
      //   .createQueryBuilder()
      //   .relation(User, 'permissions')
      //   .insert()
      //   .into(User)
      //   .values({
      //     account: registerDto.account,
      //     nickname: registerDto.nickname,
      //     password: registerDto.password,
      //     role: { name: 'user' },
      //     permissions: [
      //       {
      //         path: userPath,
      //         level: 2,
      //         readable: true,
      //         writable: true,
      //       },
      //     ],
      //     storageOrigin: userPath,
      //   })
      //   .execute();

      // await manager.save(StorageFile, {
      //   path: userPath,
      //   parent: '/',
      //   level: 2,
      //   name: registerDto.account,
      //   isDirectory: true,
      // });
      // });
    } catch (err) {
      console.log('err', index, err);
      if (err.errno === CONSTRAINT) {
        throw new BadRequestException('该账号已被注册');
      } else {
        throw new BadRequestException('注册失败');
      }
    }
    console.timeEnd();
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
