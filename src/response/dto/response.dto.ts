import { ApiProperty } from '@nestjs/swagger';
import { RESPONSE_CODE, RESPONSE_MSG } from '../types/response.enum';
import { CommonResponse } from '../types/response.interface';

/**
 * @description: 基本响应体
 */
export class ResponseDto<T = unknown> implements CommonResponse<T> {
  @ApiProperty({
    description: '状态码',
    example: RESPONSE_CODE.OK,
  })
  code: number;

  @ApiProperty({
    description: '响应信息',
    example: RESPONSE_MSG.SUCCESS,
  })
  msg: string;

  @ApiProperty({
    description: '响应数据',
  })
  data?: T;

  @ApiProperty({
    description: '时间戳',
    example: 1720685424078,
  })
  timestamp: number;
}
