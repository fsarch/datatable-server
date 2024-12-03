import { Module } from '@nestjs/common';
import { FsarchModule } from './fsarch/fsarch.module.js';
import { ControllersModule } from './controllers/controllers.module.js';
import { RepositoriesModule } from './repositories/repositories.module.js';

@Module({
  imports: [
    FsarchModule.register({
      auth: {},
    }),
    ControllersModule,
    RepositoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
