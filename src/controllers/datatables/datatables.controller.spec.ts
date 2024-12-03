import { Test, TestingModule } from '@nestjs/testing';
import { DatatablesController } from './datatables.controller';

describe('DatatablesController', () => {
  let controller: DatatablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatatablesController],
    }).compile();

    controller = module.get<DatatablesController>(DatatablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
