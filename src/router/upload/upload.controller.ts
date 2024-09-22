import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponse } from 'src/swagger/decorators/api-common-response.decorator';
import { PreCheckFileVo } from './vo/pre-check-file.vo';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { PreCheckFileDto } from './dto/pre-check-file.dto';
import { GetMultipartsVo } from './vo/get-multiparts.vo';
import { GetMultipartDto } from './dto/get-multiparts.dto';
import { MergeMultipartDto } from './dto/merge-multipart.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UploadCallbackDto } from './dto/upload-callback.dto';

@ApiTags('上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('preCheckFile')
  @ApiOperation({ summary: '预检查文件' })
  @ApiCommonResponse({
    type: PreCheckFileVo,
    example: `{
      "data": {
        "mode": "multipart",
        "value": "60CEC7ECC095466B8783DAD17B225E2B",
        "expire": 0
      },
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726983436693
    }`,
  })
  @ApiBearerAuth()
  preCheckFile(
    @GetUser() user: User,
    @Query() preCheckFileDto: PreCheckFileDto,
  ) {
    return this.uploadService.preCheckFile(user, preCheckFileDto);
  }

  @Post('getMultiparts')
  @ApiOperation({ summary: '获取分片集合' })
  @ApiCommonResponse({
    type: GetMultipartsVo,
    isArray: true,
    example: `{
      "data": [
        {
          "number": 1,
          "url": "http://yuwjoo-private-cloud-storage.oss-cn-shenzhen.aliyuncs.com/storage/yuwjoo/f3b0c44298fc1c149af-test.jpg?partNumber=1&uploadId=60CEC7ECC095466B8783DAD17B225E2B&x-oss-credential=LTAI5tF7pE8QHGZr3QPr9WMi%2F20240922%2Fcn-shenzhen%2Foss%2Faliyun_v4_request&x-oss-date=20240922T061124Z&x-oss-expires=10800&x-oss-signature-version=OSS4-HMAC-SHA256&x-oss-signature=301079268974713ffcb9b1ae22cff8ad845f0ac4e4b7562bc691797d90cfefce",
          "expire": 1726996284364
        },
        {
          "number": 2,
          "url": "http://yuwjoo-private-cloud-storage.oss-cn-shenzhen.aliyuncs.com/storage/yuwjoo/f3b0c44298fc1c149af-test.jpg?partNumber=2&uploadId=60CEC7ECC095466B8783DAD17B225E2B&x-oss-credential=LTAI5tF7pE8QHGZr3QPr9WMi%2F20240922%2Fcn-shenzhen%2Foss%2Faliyun_v4_request&x-oss-date=20240922T061124Z&x-oss-expires=10800&x-oss-signature-version=OSS4-HMAC-SHA256&x-oss-signature=0b379a0d0d63c2c4cb17930ab736ccd8dfbbb1080206b21be418b8dd1b9a4c4c",
          "expire": 1726996284364
        },
        {
          "number": 3,
          "url": "http://yuwjoo-private-cloud-storage.oss-cn-shenzhen.aliyuncs.com/storage/yuwjoo/f3b0c44298fc1c149af-test.jpg?partNumber=3&uploadId=60CEC7ECC095466B8783DAD17B225E2B&x-oss-credential=LTAI5tF7pE8QHGZr3QPr9WMi%2F20240922%2Fcn-shenzhen%2Foss%2Faliyun_v4_request&x-oss-date=20240922T061124Z&x-oss-expires=10800&x-oss-signature-version=OSS4-HMAC-SHA256&x-oss-signature=d65f6a073ca4674d484226d9e01c63286c90c1e7842e5705023857332cef5dc1",
          "expire": 1726996284364
        }
      ],
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726985484365
    }`,
  })
  @ApiBearerAuth()
  getMultiparts(
    @GetUser() user: User,
    @Body() getMultipartDto: GetMultipartDto,
  ) {
    return this.uploadService.getMultiparts(user, getMultipartDto);
  }

  @Post('mergeMultipart')
  @ApiOperation({ summary: '合并上传的分片' })
  @ApiCommonResponse({})
  @ApiBearerAuth()
  mergeMultipart(
    @GetUser() user: User,
    @Body() mergeMultipartDto: MergeMultipartDto,
  ) {
    return this.uploadService.mergeMultipart(user, mergeMultipartDto);
  }

  @Post('callback')
  @ApiOperation({ summary: '上传回调' })
  @ApiCommonResponse({})
  @ApiBearerAuth()
  @Public()
  callback(@Body() uploadCallbackDto: UploadCallbackDto) {
    return this.uploadService.callback(uploadCallbackDto);
  }
}
