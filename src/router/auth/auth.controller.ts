import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/shared-modules/user/user.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiCommonResponse } from 'src/swagger/decorators/api-common-response.decorator';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginDto })
  @ApiCommonResponse({ type: LoginResponseDto })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@GetUser() user: User): Promise<LoginResponseDto> {
    const loginRecord = await this.userService.addLoginRecord(
      user,
      this.authService.generateToken(user),
    );
    return {
      token: loginRecord.token,
      user: {
        account: user.account,
        nickname: user.nickname,
        avatar: user.avatar,
        status: user.status,
        roles: user.roles.map((role) => ({
          name: role.name,
          describe: role.describe,
        })),
        storageOrigin: user.storageOrigin,
      },
    };
  }

  @ApiOperation({ summary: '注册' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const oldUser = await this.userService.findOne(registerDto.account);
    if (oldUser) {
      throw new BadRequestException('该账号已被注册');
    }

    throw new UnauthorizedException();
    console.log(registerDto);
    return 'user';
  }
}
