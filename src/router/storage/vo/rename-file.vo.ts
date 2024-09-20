import { Permission } from 'src/database/entities/permission.entity';
import { FileDto } from '../dto/file-dto';
import { StorageFile } from 'src/database/entities/storage-file.entity';

export class RenameFileVo extends FileDto {
  constructor(
    storageFile: StorageFile,
    permission: Pick<Permission, 'readable' | 'writable'>,
  ) {
    super();
    this.path = storageFile.path;
    this.parent = storageFile.parent;
    this.level = storageFile.level;
    this.size = storageFile.size;
    this.name = storageFile.name;
    this.isDirectory = storageFile.isDirectory;
    this.createdTime = storageFile.createdDate.getTime();
    this.updatedTime = storageFile.updatedDate.getTime();
    this.readable = permission.readable;
    this.writable = permission.writable;
  }
}
