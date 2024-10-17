import OSS from 'ali-oss';

export interface OSSExtend extends OSS {
  signatureUrlV4: (
    method: string,
    expires: number,
    request?: {
      headers?: Record<string, any>;
      queries?: Record<string, any>;
    },
    objectName?: string,
    additionalHeaders?: string[],
  ) => Promise<string>;
}

export interface SingUrlInfo {
  url: string;
  expire: number;
}
