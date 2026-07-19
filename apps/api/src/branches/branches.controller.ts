import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CentralAdminGuard } from '../auth/central-admin.guard';
import { SessionGuard } from '../auth/session.guard';
import type { BranchView } from './branch.types';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './create-branch.dto';

@Controller('branches')
@UseGuards(SessionGuard, CentralAdminGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async list(): Promise<{ branches: BranchView[] }> {
    return { branches: await this.branchesService.list() };
  }

  @Post()
  async create(
    @Body() input: CreateBranchDto,
  ): Promise<{ branch: BranchView }> {
    return { branch: await this.branchesService.create(input) };
  }
}
