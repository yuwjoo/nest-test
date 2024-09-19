import { ApiProperty } from '@nestjs/swagger';
import { PageData } from '../types/response.interface';

/**
 * @description: 分页数据
 */
export class PageDataDto<T = unknown> implements PageData<T> {
  @ApiProperty({ description: '当前页' })
  current?: number;

  @ApiProperty({ description: '每页数量' })
  size?: number;

  @ApiProperty({ description: '总数' })
  total?: number;

  @ApiProperty({ description: '列表数据' })
  records: T[];
}
