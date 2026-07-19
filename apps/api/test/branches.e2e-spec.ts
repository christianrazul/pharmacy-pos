import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'argon2';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/bootstrap';
import { PrismaService } from '../src/database/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

const testUsername = `e2e-branches-${process.pid}`;
const testCodePrefix = `E2E-${process.pid}-`;

beforeAll(async () => {
  process.env.SESSION_COOKIE_NAME = 'test_pharmacy_pos_session';
  process.env.SESSION_TTL_HOURS = '1';

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  configureApplication(app);
  await app.init();
  prisma = app.get(PrismaService);
});

beforeEach(async () => {
  await prisma.branch.deleteMany({
    where: { code: { startsWith: testCodePrefix } },
  });
  await prisma.user.deleteMany({ where: { username: testUsername } });

  await prisma.user.create({
    data: {
      username: testUsername,
      passwordHash: String(await hash('ValidTestPassword2026!')),
      role: 'CENTRAL_ADMIN',
    },
  });
});

afterAll(async () => {
  await prisma.branch.deleteMany({
    where: { code: { startsWith: testCodePrefix } },
  });
  await prisma.user.deleteMany({ where: { username: testUsername } });
  await app.close();
});

it('requires authentication to add or list branches', async () => {
  await request(app.getHttpServer()).get('/branches').expect(401);
  await request(app.getHttpServer())
    .post('/branches')
    .send({ name: 'Main Pharmacy', code: `${testCodePrefix}MAIN` })
    .expect(401);

  await expect(testBranchCount()).resolves.toBe(0);
});

it('normalizes, persists, and lists active branches alphabetically', async () => {
  const cookie = await login();

  const second = await createBranch(cookie, {
    name: '  West Pharmacy  ',
    code: ` ${testCodePrefix.toLowerCase()}west-01 `,
    address: '  25 West Avenue  ',
  });
  const first = await createBranch(cookie, {
    name: 'Central Pharmacy',
    code: `${testCodePrefix.toLowerCase()}central-01`,
    address: '',
  });

  expect(second).toMatchObject({
    name: 'West Pharmacy',
    code: `${testCodePrefix}WEST-01`,
    address: '25 West Avenue',
    status: 'ACTIVE',
  });
  expect(first).toMatchObject({
    name: 'Central Pharmacy',
    code: `${testCodePrefix}CENTRAL-01`,
    address: null,
    status: 'ACTIVE',
  });

  const response = await request(app.getHttpServer())
    .get('/branches')
    .set('Cookie', cookie)
    .expect(200);
  const body = response.body as {
    branches: Array<{ id: string; name: string; code: string }>;
  };

  const testBranches = body.branches.filter(({ code }) =>
    code.startsWith(testCodePrefix),
  );
  expect(testBranches.map(({ name }) => name)).toEqual([
    'Central Pharmacy',
    'West Pharmacy',
  ]);
  expect(testBranches.every(({ id }) => typeof id === 'string')).toBe(true);
});

it('rejects duplicate normalized branch codes', async () => {
  const cookie = await login();
  await createBranch(cookie, {
    name: 'Main Pharmacy',
    code: `${testCodePrefix}MAIN-01`,
  });

  const response = await request(app.getHttpServer())
    .post('/branches')
    .set('Cookie', cookie)
    .send({
      name: 'Other Pharmacy',
      code: ` ${testCodePrefix.toLowerCase()}main-01 `,
    })
    .expect(409);

  expect(response.body).toMatchObject({
    message: 'Branch code is already in use',
  });
  await expect(testBranchCount()).resolves.toBe(1);
});

it('rejects invalid branch input and client-controlled status', async () => {
  const cookie = await login();

  await request(app.getHttpServer())
    .post('/branches')
    .set('Cookie', cookie)
    .send({ name: ' ', code: 'invalid code' })
    .expect(400);
  await request(app.getHttpServer())
    .post('/branches')
    .set('Cookie', cookie)
    .send({
      name: 'Inactive Pharmacy',
      code: `${testCodePrefix}INACTIVE`,
      status: 'INACTIVE',
    })
    .expect(400);

  await expect(testBranchCount()).resolves.toBe(0);
});

async function login(): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      username: testUsername,
      password: 'ValidTestPassword2026!',
    })
    .expect(200);
  const cookie = response.get('Set-Cookie')?.[0];

  if (!cookie) {
    throw new Error('Expected login to return a session cookie');
  }

  return cookie;
}

async function testBranchCount(): Promise<number> {
  return prisma.branch.count({
    where: { code: { startsWith: testCodePrefix } },
  });
}

async function createBranch(
  cookie: string,
  input: { name: string; code: string; address?: string },
): Promise<{
  id: string;
  name: string;
  code: string;
  address: string | null;
  status: string;
}> {
  const response = await request(app.getHttpServer())
    .post('/branches')
    .set('Cookie', cookie)
    .send(input)
    .expect(201);

  const body = response.body as {
    branch: {
      id: string;
      name: string;
      code: string;
      address: string | null;
      status: string;
    };
  };

  return body.branch;
}
