import { HttpStatus } from '@nestjs/common';

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
