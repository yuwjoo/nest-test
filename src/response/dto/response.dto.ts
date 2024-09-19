import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../types/response.interface';

/**
 * @description: 基本响应体
 */
export class ResponseDto<T = unknown> implements CommonResponse<T> {
  @ApiProperty({ description: '状态码' })
  code: number;

  @ApiProperty({ description: '响应信息' })
  msg: string;

  @ApiProperty({ description: '响应数据' })
  data?: T;

  @ApiProperty({ description: '时间戳' })
  timestamp: number;
}
