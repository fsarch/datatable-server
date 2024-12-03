import { Test, TestingModule } from '@nestjs/testing';
import { DatatablesRepositoryService } from './datatables-repository.service.js';

describe('DatatablesRepositoryService', () => {
  let service: DatatablesRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatatablesRepositoryService],
    }).compile();

    service = module.get<DatatablesRepositoryService>(DatatablesRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
