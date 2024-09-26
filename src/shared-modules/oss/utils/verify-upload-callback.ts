import { Request } from 'express';
import * as http from 'http';
import * as https from 'https';
import { createVerify } from 'crypto';

let cachePublicKey: string; // 缓存的oss公钥

/**
 * @description: 验证oss上传回调
 * @param {Request} req expressi请求对象
 * @param {string} targetBucket 目标bucket
 */
export async function verifyUploadCallback(req: Request, targetBucket: string) {
  const publickKey = await getPublicKey(req); // oss公钥
  const signature = getAuthorization(req); // 签名
  const sign_str = getSignStr(req); // 待签名字符串
  const verifySign = verifySignature(publickKey, signature, sign_str); // 校验签名
  const verifyBucket = req.headers['x-oss-bucket'] === targetBucket; // 校验bucket

  if (!verifySign || !verifyBucket) {
    return Promise.reject('OSS signature verification failed');
  }
}

/**
 * @description: 获取OSS的公钥
 * @param {Request} req 请求对象
 * @return {Promise<string>} 公钥文本
 */
async function getPublicKey(req: Request): Promise<string> {
  const pubKeyUrl = Buffer.from(
    req.headers['x-oss-pub-key-url'] as string,
    'base64',
  ).toString();
  let httplib: typeof http | typeof https;

  if (pubKeyUrl.startsWith('http://gosspublic.alicdn.com/')) {
    httplib = http;
  } else if (pubKeyUrl.startsWith('https://gosspublic.alicdn.com/')) {
    httplib = https;
  }
  if (!httplib) {
    throw new Error('Failed: x-oss-pub-key-url field is not valid.');
  }
  if (cachePublicKey) return cachePublicKey; // 使用缓存的公钥
  return new Promise((resolve, reject) => {
    httplib.get(pubKeyUrl, async (res) => {
      if (res.statusCode !== 200) {
        reject(
          new Error(
            `Failed: Get OSS public key ${res.statusCode} ${res.statusMessage}`,
          ),
        );
      } else {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          cachePublicKey = rawData;
          resolve(rawData);
        });
        res.on('error', (err) => {
          reject(err);
        });
      }
    });
  });
}

/**
 * @description: 获取base64解码后OSS的签名header
 * @param {Request} req 请求对象
 * @return {Buffer} 签名
 */
function getAuthorization(req: Request): Buffer {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    throw new Error('Failed: authorization field is not valid.');
  }
  return Buffer.from(authorization, 'base64');
}

/**
 * @description: 获取待签名字符串
 * @param {Request} req 请求对象
 * @return {string} 待签名字符串
 */
function getSignStr(req: Request): string {
  const fullReqUrl = new URL(req.url, `http://${req.headers.host}`);
  const rawBody = Buffer.from((req as any).rawBody, 'base64').toString();
  return (
    decodeURIComponent(fullReqUrl.pathname) + fullReqUrl.search + '\n' + rawBody
  );
}

/**
 * @description: 验证签名
 * @param {string} pubKey 公钥
 * @param {Buffer} signature 签名
 * @param {string} byteMD5 待签名字符串
 * @return {boolean} 校验结果
 */
function verifySignature(
  pubKey: string,
  signature: Buffer,
  byteMD5: string,
): boolean {
  const verify = createVerify('RSA-MD5');
  verify.update(byteMD5);
  return verify.verify(pubKey, signature);
}
