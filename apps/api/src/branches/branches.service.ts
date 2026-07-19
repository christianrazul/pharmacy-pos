import { ConflictException, Injectable } from '@nestjs/common';
import type { Branch } from '../generated/prisma/client';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { BranchView } from './branch.types';
import type { CreateBranchDto } from './create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<BranchView[]> {
    const branches = await this.prisma.branch.findMany({
      orderBy: [{ name: 'asc' }, { code: 'asc' }],
    });

    return branches.map(toBranchView);
  }

  async create(input: CreateBranchDto): Promise<BranchView> {
    try {
      const branch = await this.prisma.branch.create({
        data: {
          name: input.name.trim(),
          code: input.code.trim().toUpperCase(),
          address: input.address?.trim() || null,
        },
      });

      return toBranchView(branch);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Branch code is already in use');
      }

      throw error;
    }
  }
}

function toBranchView(branch: Branch): BranchView {
  return {
    id: branch.id,
    code: branch.code,
    name: branch.name,
    address: branch.address,
    status: branch.status,
  };
}
