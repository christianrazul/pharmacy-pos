import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth(): Promise<{ status: 'ok' }> {
    await this.prisma.$queryRaw`SELECT 1`;

    return { status: 'ok' };
  }
}
