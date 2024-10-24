import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { User } from 'src/entities/user.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponse } from 'src/decorators/api-common-response.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { GetToken } from 'src/decorators/get-token.decorator';
import { LoginVo } from './vo/login.vo';
import {
  loginResponseExample,
  logoutResponseExample,
  registerResponseExample,
} from './auth.example';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册账号' })
  @ApiCommonResponse({ example: registerResponseExample })
  @Public()
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '登录账号' })
  @ApiBody({ type: LoginRequestDto })
  @ApiCommonResponse({ type: LoginVo, example: loginResponseExample })
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: User): Promise<LoginVo> {
    return await this.authService.login(user);
  }

  @Get('logout')
  @ApiOperation({ summary: '登出账号' })
  @ApiCommonResponse({ example: logoutResponseExample })
  @ApiBearerAuth()
  async logout(@GetToken() token: string): Promise<void> {
    return await this.authService.logout(token);
  }
}
