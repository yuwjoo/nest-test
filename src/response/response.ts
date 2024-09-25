import * as dayjs from 'dayjs';
import { RESPONSE_CODE, RESPONSE_MSG } from './types/response.enum';
import { CommonResponse } from './types/response.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';

/**
 * @description: 初始化响应模块
 * @param {NestExpressApplication} app 应用实例
 */
export function initResponseModule(app: NestExpressApplication) {
  app.useGlobalFilters(new AllExceptionsFilter()); // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter()); // Http异常过滤器
}

/**
 * @description: 创建响应数据
 * @param {T} data 响应数据
 * @param {string} msg 响应信息
 * @param {number} code 状态码
 * @return {CommonResponse<T>} 响应数据
 */
export function createResponse<T = unknown>(
  data: T,
  msg: string = RESPONSE_MSG.SUCCESS,
  code: number = RESPONSE_CODE.OK,
): CommonResponse<T> {
  return { data, msg, code, timestamp: dayjs().valueOf() };
}
