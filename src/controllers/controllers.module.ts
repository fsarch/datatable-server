import { Module } from '@nestjs/common';
import { DatatablesModule } from './datatables/datatables.module.js';

@Module({
  imports: [DatatablesModule]
})
export class ControllersModule {}
