import { OmitType } from '@nestjs/mapped-types';
import { MultipartDto } from '../dto/multipart.dto';

export class GetMultipartsVo extends OmitType(MultipartDto, ['etag']) {
  constructor(getMultipartsVo: GetMultipartsVo) {
    super();
    this.number = getMultipartsVo.number;
    this.url = getMultipartsVo.url;
    this.expire = getMultipartsVo.expire;
  }
}
