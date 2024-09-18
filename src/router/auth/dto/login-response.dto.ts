import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoieXV3am9vIiwiaWF0IjoxNzI2NjI5NjQ5LCJleHAiOjE3MjkyMjE2NDl9.Z62zDMUpyGnid5LXh4E8jHSxR6lUFPE8io06lk98TfM',
  })
  token: string;

  @ApiProperty({
    description: '用户信息',
  })
  user: UserDto;
}
