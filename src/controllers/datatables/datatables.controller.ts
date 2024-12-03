import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DatatablesService } from "./datatables.service.js";

@ApiTags('datatables')
@Controller({
  path: 'datatables',
  version: '1',
})
@ApiBearerAuth()
export class DatatablesController {
  constructor(private readonly datatablesService: DatatablesService) {}

  @Get()
  public async List() {
    return this.datatablesService.List();
  }
}
