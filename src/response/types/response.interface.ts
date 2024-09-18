/**
 * @description: 基本响应体
 */
export interface CommonResponse<T = unknown> {
  code: number; // 状态码
  data?: T; // 业务数据
  msg: string; // 响应信息
  timestamp: number; // 时间戳
}

/**
 * @description: 分页数据
 */
export interface PageData<T = unknown> {
  current?: number; // 页码
  size?: number; // 当前页条数
  total?: number; // 总条数
  records: T[]; // 业务数据
}
