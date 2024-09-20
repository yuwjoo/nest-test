import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { FileListDto } from './dto/file-list-dto';
import { ApiCommonResponse } from 'src/swagger/decorators/api-common-response.decorator';
import { FileListVo } from './vo/file-list.vo';
import { CreateFileDto } from './dto/create-file.dto';
import { RenameFileDto } from './dto/rename-file.dto';
import { CreateFileVo } from './vo/create-file.vo';
import { RenameFileVo } from './vo/rename-file.vo';
import { DeleteFileDto } from './dto/delete-file.dto';

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
            "updatedTime": 1726810130000,
            "readable": true,
            "writable": true
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

  @Post('create')
  @ApiOperation({ summary: '创建目录/文件' })
  @ApiCommonResponse({
    type: CreateFileVo,
    example: `{
      "data": {
        "path": "/yuwjoo/test32",
        "parent": "/yuwjoo",
        "level": 3,
        "size": 253,
        "name": "test32",
        "isDirectory": false,
        "createdTime": 1726837632000,
        "updatedTime": 1726837632000,
        "readable": true,
        "writable": true
      },
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726837632896
    }`,
  })
  @ApiBearerAuth()
  create(@GetUser() user: User, @Body() createFileDto: CreateFileDto) {
    return this.storageService.create(user, createFileDto);
  }

  @Post('rename')
  @ApiOperation({ summary: '重命名目录/文件' })
  @ApiCommonResponse({
    type: RenameFileVo,
    example: `{
      "data": {
        "path": "/yuwjoo/test3o",
        "parent": "/yuwjoo",
        "level": 3,
        "size": 0,
        "name": "test3o",
        "isDirectory": true,
        "createdTime": 1726824632000,
        "updatedTime": 1726840647000,
        "readable": true,
        "writable": true
      },
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726840647796
    }`,
  })
  @ApiBearerAuth()
  rename(@GetUser() user: User, @Body() renameFileDto: RenameFileDto) {
    return this.storageService.rename(user, renameFileDto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除目录/文件' })
  @ApiCommonResponse({
    example: `{
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726840647796
    }`,
  })
  @ApiBearerAuth()
  delete(@GetUser() user: User, @Body() deleteFileDto: DeleteFileDto) {
    return this.storageService.delete(user, deleteFileDto);
  }
}
