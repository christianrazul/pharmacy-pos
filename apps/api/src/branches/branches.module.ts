import { Module } from '@nestjs/common';
import { CentralAdminGuard } from '../auth/central-admin.guard';
import { AuthModule } from '../auth/auth.module';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';

@Module({
  imports: [AuthModule],
  controllers: [BranchesController],
  providers: [BranchesService, CentralAdminGuard],
})
export class BranchesModule {}
