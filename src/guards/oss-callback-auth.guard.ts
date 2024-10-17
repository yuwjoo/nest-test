import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DEFAULT_CONFIG } from 'src/common/constants';
import { verifyUploadCallback } from 'src/common/oss-upload-callback';
import { DefaultConfig } from 'src/interfaces/configuration.interface';

@Injectable()
export class OssCallbackAuthGuard implements CanActivate {
  constructor(@Inject(DEFAULT_CONFIG) readonly config: DefaultConfig) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return verifyUploadCallback(request, this.config.oss.bucket);
  }
}
