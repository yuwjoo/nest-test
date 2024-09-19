import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRecord } from 'src/database/entities/login-record.entity';
import { User } from 'src/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService as FunAuthService } from 'src/auth/auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { Permission } from 'src/database/entities/permission.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authService: FunAuthService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @description: 登录
   * @param {User} user 用户信息
   * @return {Promise<LoginResponseDto>} 登录信息
   */
  async login(user: User): Promise<LoginResponseDto> {
    const token = this.authService.generateToken(user);

    await this.dataSource.transaction(async (manager) => {
      if (user.loginRecords.length > 5) {
        manager.delete(LoginRecord, user.loginRecords[0].token);
      }
      manager.save(LoginRecord, { user, token });
    });

    return new LoginResponseDto({ user, token });
  }

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

    await this.dataSource.transaction(async (manager) => {
      const permission = await manager.save(Permission, {
        path: '/' + registerDto.account,
        level: 2,
        readable: true,
        writable: true,
      });
      await manager.save(User, {
        account: registerDto.account,
        nickname: registerDto.nickname,
        password: registerDto.password,
        permissions: [permission],
        storageOrigin: '/' + registerDto.account,
      });
    });
  }
}
