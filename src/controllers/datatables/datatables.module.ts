import { Module } from '@nestjs/common';
import { DatatablesService } from './datatables.service.js';
import { DatatablesController } from './datatables.controller.js';

@Module({
  providers: [DatatablesService],
  controllers: [DatatablesController]
})
export class DatatablesModule {}
