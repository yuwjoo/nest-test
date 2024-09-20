import { Controller, Get, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { FileListDto } from './dto/file-list-dto';
import { ApiCommonResponse } from 'src/swagger/decorators/api-common-response.decorator';
import { FileListVo } from './vo/file-list.vo';

@ApiTags('存储')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('list')
  @ApiOperation({ summary: '获取文件列表' })
  @ApiCommonResponse({
    type: FileListVo,
    example: `{
      "data": {
        "current": 1,
        "size": 3,
        "total": 3,
        "records": [
          {
            "path": "/public",
            "parent": "/",
            "level": 2,
            "name": "public",
            "isDirectory": true,
            "createdTime": 1726810130000,
            "updatedTime": 1726810130000
          },
          {
            "path": "/admin",
            "parent": "/",
            "level": 2,
            "name": "admin",
            "isDirectory": true,
            "createdTime": 1726810130000,
            "updatedTime": 1726810130000
          },
          {
            "path": "/yuwjoo",
            "parent": "/",
            "level": 2,
            "name": "yuwjoo",
            "isDirectory": true,
            "createdTime": 1726810189000,
            "updatedTime": 1726810189000
          }
        ]
      },
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726823336965
    }`,
  })
  @ApiBearerAuth()
  list(@GetUser() user: User, @Query() fileListDto: FileListDto) {
    return this.storageService.list(user, fileListDto);
  }
}
