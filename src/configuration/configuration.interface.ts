export interface DefaultConfig {
  env: 'development' | 'production'; // 当前环境
  server: {
    protocol: string; // 协议
    host: string; // 服务器host
    port: number; // 监听端口
  };
  tempTokenExpirationTime: number; // 临时token过期时间（单位：秒）
  tokenExpirationTime: number; // 长期token过期时间（单位：秒）
  ossStsExpirationTime: number; // oss临时凭证过期时间（单位：秒）
  secretKeyBase64: string; // 安全密钥base64字符串
  ivBase64: string; // iv base64字符串
  publicKeyBase64: string; // 非对称加密公钥base64字符串
  privateKeyBase64: string; // 非对称加密私钥base64字符串
  admin: {
    account: string; // 默认账号
    password: string; // 默认密码
  };
  database: {
    mysql: {
      host: string; // 数据库host
      port: number; // 数据库端口
      database: string; // 数据库名称
      username: string; // 用户名
      password: string; // 密码
    };
    sqlite: {
      database: string; // 数据库路径
    };
  };
  oss: {
    region: string; // 地区
    bucketName: string; // bucket名称
    adminAccount: string; // admin账号
    adminAccessKeyID: string; // admin AccessKeyID
    adminAccessKeySecret: string; // admin AccessKeySecret
    stsAccount: string; // sts账号
    stsAccessKeyID: string; // sts AccessKeyID
    stsAccessKeySecret: string; // sts AccessKeySecret
    stsRAMRole: string; // sts角色
    uploadSignExpire: number; // 上传签名过期时间（单位：秒）
    downloadSignExpire: number; // 下载签名过期时间（单位：秒）
    uploadCallbackUrl: string; // 上传回调地址
    uploadPublicKeyBase64: string; // 上传回调签名公钥base64字符串
  };
}
