/*
 * @FileName: 中间件-跨域处理
 * @FilePath: \test\src\middleware\cors.ts
 * @Author: YH
 * @Date: 2024-09-06 15:30:50
 * @LastEditors: YH
 * @LastEditTime: 2024-09-06 15:38:24
 * @Description:
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class CORSMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*'); //设置允许跨域的域名，*代表允许任意域名跨域
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
    ); //允许的header类型
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS'); //跨域允许的请求方式
    if (req.method.toLowerCase() == 'options') {
      res.sendStatus(200).send(); //让options尝试请求快速结束
    } else {
      next();
    }
  }
}
