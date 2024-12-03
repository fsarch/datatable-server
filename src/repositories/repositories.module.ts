import { Module } from '@nestjs/common';
import { DatatablesRepositoryModule } from './datatables-repository/datatables-repository.module.js';

@Module({
  imports: [DatatablesRepositoryModule]
})
export class RepositoriesModule {}
