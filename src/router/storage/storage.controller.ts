import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
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
import { MoveFileVo } from './vo/move-file.vo';
import { MoveFileDto } from './dto/move-file.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Raw } from 'src/response/decorators/raw.decorator';
import { GetFileCoverDto } from './dto/get-file-cover.dto';
import { BatchDeleteFileDto } from './dto/batch-delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';

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

  @Post('move')
  @ApiOperation({ summary: '移动目录/文件' })
  @ApiCommonResponse({
    type: MoveFileVo,
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
  move(@GetUser() user: User, @Body() moveFileDto: MoveFileDto) {
    return this.storageService.move(user, moveFileDto);
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

  @Post('batchDelete')
  @ApiOperation({ summary: '批量删除目录/文件' })
  @ApiCommonResponse({
    example: `{
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1726840647796
    }`,
  })
  @ApiBearerAuth()
  batchDelete(
    @GetUser() user: User,
    @Body() batchDeleteFileDto: BatchDeleteFileDto,
  ) {
    return this.storageService.batchDelete(user, batchDeleteFileDto);
  }

  @Get('getFileCover')
  @ApiOperation({ summary: '获取文件封面' })
  @ApiBearerAuth()
  @Redirect()
  @Public()
  @Raw()
  async getFileCover(@Query() getFileCoverDto: GetFileCoverDto) {
    return { url: await this.storageService.getFileCover(getFileCoverDto) };
  }

  @Get('downloadFile')
  @ApiOperation({ summary: '下载文件' })
  @ApiCommonResponse({
    example: `{
      "data": "http://yuwjoo-private-cloud-storage.oss-cn-shenzhen.aliyuncs.com/1?OSSAccessKeyId=LTAI5tF7pE8QHGZr3QPr9WMi&Expires=1727255087&Signature=7P1B330PwWuADDZZ9IhNysEHIPI%3D&response-content-disposition=attachment%3B%20filename%3Dtest232",
      "msg": "请求成功",
      "code": 200,
      "timestamp": 1727255081675
    }`,
  })
  @ApiBearerAuth()
  async downloadFile(
    @GetUser() user: User,
    @Query() downloadFileDto: DownloadFileDto,
  ) {
    return this.storageService.downloadFile(user, downloadFileDto);
  }
}
