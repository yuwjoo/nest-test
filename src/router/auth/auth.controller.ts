import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponse } from 'src/swagger/decorators/api-common-response.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { GetToken } from 'src/auth/decorators/get-token.decorator';
import { LoginVo } from './vo/login.vo';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册账号' })
  @ApiCommonResponse({
    example: `{
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726733020937
    }`,
  })
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '登录账号' })
  @ApiBody({ type: LoginDto })
  @ApiCommonResponse({
    type: LoginVo,
    example: `{
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoieXV3am9vIiwiaWF0IjoxNzI2Nzk2NzkzLCJleHAiOjE3MjkzODg3OTN9.YHc7uXWSrxxXn1bh9v1TiohvzeVxV75QXokz2DPotdM",
        "user": {
          "account": "yuwjoo",
          "nickname": "YH",
          "avatar": "",
          "status": "enable",
          "role": {
            "name": "user",
            "describe": "普通用户"
          },
          "storageOrigin": "/yuwjoo"
        }
      },
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726796793714
    }`,
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: User): Promise<LoginVo> {
    return await this.authService.login(user);
  }

  @Get('logout')
  @ApiOperation({ summary: '登出账号' })
  @ApiCommonResponse({
    example: `{
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726733020937
    }`,
  })
  @ApiBearerAuth()
  async logout(@GetToken() token: string) {
    await this.authService.logout(token);
  }
}
