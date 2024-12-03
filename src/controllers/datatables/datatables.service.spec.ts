import { Test, TestingModule } from '@nestjs/testing';
import { DatatablesService } from './datatables.service';

describe('DatatablesService', () => {
  let service: DatatablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatatablesService],
    }).compile();

    service = module.get<DatatablesService>(DatatablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
