import { Module } from '@nestjs/common';
import { DatatablesController } from './datatables.controller.js';
import { DataModule } from './data/data.module.js';
import { DatatablesRepositoryModule } from "../../repositories/datatables-repository/datatables-repository.module.js";

@Module({
  controllers: [DatatablesController],
  imports: [DataModule, DatatablesRepositoryModule],
})
export class DatatablesModule {}
