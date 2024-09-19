import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiCommonResponse } from 'src/swagger/decorators/api-common-response.decorator';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ResponseDto } from 'src/response/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册账号' })
  @ApiOkResponse({
    type: ResponseDto,
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
    type: LoginResponseDto,
    example: `{
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoieXV3am9vIiwiaWF0IjoxNzI2NzMyNzA4LCJleHAiOjE3MjkzMjQ3MDh9.8V60MzWt9gHhQ3dBWCkpXEdgdTJN5AoMUs2iObhj2Q0",
        "user": {
          "account": "yuwjoo",
          "nickname": "YH",
          "avatar": null,
          "status": "enable",
          "roles": [],
          "storageOrigin": "/yuwjoo"
        }
      },
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726732708520
    }`,
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: User): Promise<LoginResponseDto> {
    return await this.authService.login(user);
  }
}
