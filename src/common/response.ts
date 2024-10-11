import { HttpStatus } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CommonResponse } from 'src/interfaces/response.interface';

/**
 * @description: 响应码
 */
export enum RESPONSE_CODE {
  OK = HttpStatus.OK, // 请求成功
  BAD_REQUEST = HttpStatus.BAD_REQUEST, // 请求错误
  UNAUTHORIZED = HttpStatus.UNAUTHORIZED, // 未授权
  FORBIDDEN = HttpStatus.FORBIDDEN, // 禁止访问
  NOT_FOUND = HttpStatus.NOT_FOUND, // 资源未找到
  INTERNAL_SERVER_ERROR = HttpStatus.INTERNAL_SERVER_ERROR, // 服务器错误
}

/**
 * @description: 请求提示语
 */
export enum RESPONSE_MSG {
  SUCCESS = '请求成功',
  FAILURE = '请求失败',
  SERVER_ERROR = '服务器内部错误!',
}

/**
 * @description: 创建基本响应数据
 * @param {T} data 响应数据
 * @param {string} msg 响应信息
 * @param {number} code 状态码
 * @return {CommonResponse<T>} 响应数据
 */
export function createCommonResponse<T = unknown>(
  data: T,
  msg: string = RESPONSE_MSG.SUCCESS,
  code: number = RESPONSE_CODE.OK,
): CommonResponse<T> {
  return { data, msg, code, timestamp: dayjs().valueOf() };
}
