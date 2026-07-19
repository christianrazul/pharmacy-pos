import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';
import { requiredEnvironment } from '../config/environment';
import { PrismaClient } from '../generated/prisma/client';

async function createAdmin(): Promise<void> {
  const username = requiredEnvironment('ADMIN_USERNAME').toLowerCase();
  const password = requiredEnvironment('ADMIN_PASSWORD');
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;

  validateCredentials(username, password);

  const adapter = new PrismaPg({
    connectionString: requiredEnvironment('DATABASE_URL'),
  });
  const prisma = new PrismaClient({ adapter });

  try {
    await provisionAdmin(prisma, { username, password, email });
  } finally {
    await prisma.$disconnect();
  }
}

function validateCredentials(username: string, password: string): void {
  if (username.length < 3 || username.length > 64) {
    throw new Error('ADMIN_USERNAME must contain 3–64 characters');
  }

  if (password.length < 14 || password.length > 128) {
    throw new Error('ADMIN_PASSWORD must contain 14–128 characters');
  }
}

async function provisionAdmin(
  prisma: PrismaClient,
  input: { username: string; password: string; email: string | null },
): Promise<void> {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'CENTRAL_ADMIN' },
  });

  if (existingAdmin) {
    console.log(
      `Central administrator already exists: ${existingAdmin.username}`,
    );
    return;
  }

  const passwordHash = String(
    await hash(input.password, {
      type: 2,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    }),
  );

  const admin = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      role: 'CENTRAL_ADMIN',
    },
  });

  console.log(`Created central administrator: ${admin.username}`);
}

void createAdmin().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Failed to create central administrator: ${message}`);
  process.exitCode = 1;
});
