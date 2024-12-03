import { Module } from '@nestjs/common';
import { DatatablesRepositoryService } from './datatables-repository.service.js';

@Module({
  providers: [DatatablesRepositoryService],
  exports: [DatatablesRepositoryService],
})
export class DatatablesRepositoryModule {}
