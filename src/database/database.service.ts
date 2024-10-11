import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(readonly manager: EntityManager) {}
}
