import { Module } from '@nestjs/common';
import { FsarchModule } from './fsarch/fsarch.module.js';
import { ControllersModule } from './controllers/controllers.module.js';

@Module({
  imports: [
    FsarchModule.register({
      auth: {},
    }),
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
