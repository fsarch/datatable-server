import { Module } from '@nestjs/common';
import { DataService } from './data.service.js';
import { DataController } from './data.controller.js';
import {
  DatatablesRepositoryModule
} from "../../../repositories/datatables-repository/datatables-repository.module.js";

@Module({
  providers: [DataService],
  controllers: [DataController],
  imports: [DatatablesRepositoryModule],
})
export class DataModule {}
