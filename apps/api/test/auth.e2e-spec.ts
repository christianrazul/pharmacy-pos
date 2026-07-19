import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'argon2';
import request, { type Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/bootstrap';
import { PrismaService } from '../src/database/prisma.service';

let app: INestApplication;
let prisma: PrismaService;
let testUserId: string;

const testUsername = `e2e-auth-${process.pid}`;

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
  await prisma.user.deleteMany({ where: { username: testUsername } });
  const user = await prisma.user.create({
    data: {
      username: testUsername,
      passwordHash: String(await hash('ValidTestPassword2026!')),
      role: 'CENTRAL_ADMIN',
    },
  });
  testUserId = user.id;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { username: testUsername } });
  await app.close();
});

it('rejects invalid credentials without creating a session', async () => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      username: testUsername,
      password: 'IncorrectPassword2026!',
    })
    .expect(401);

  expect(response.headers['set-cookie']).toBeUndefined();
  await expect(
    prisma.session.count({ where: { userId: testUserId } }),
  ).resolves.toBe(0);
});

it('rejects an unauthenticated session lookup', async () => {
  await request(app.getHttpServer()).get('/auth/me').expect(401);
});

it('creates, resolves, and invalidates an administrator session', async () => {
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      username: testUsername,
      password: 'ValidTestPassword2026!',
    })
    .expect(200);
  const cookie = assertLoginResponse(loginResponse);

  await expectCurrentUser(cookie);
  await expectLogoutInvalidates(cookie, testUserId);
});

function assertLoginResponse(loginResponse: Response): string {
  const loginBody = loginResponse.body as {
    user: {
      id: string;
      username: string;
      email: string | null;
      role: string;
    };
  };
  expect(typeof loginBody.user.id).toBe('string');
  expect(loginBody.user).toMatchObject({
    username: testUsername,
    email: null,
    role: 'CENTRAL_ADMIN',
  });

  const cookie = loginResponse.get('Set-Cookie')?.[0];
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toContain('SameSite=Lax');

  if (!cookie) {
    throw new Error('Expected login to return a session cookie');
  }

  return cookie;
}

async function expectCurrentUser(cookie: string): Promise<void> {
  const currentUserResponse = await request(app.getHttpServer())
    .get('/auth/me')
    .set('Cookie', cookie)
    .expect(200);
  const currentUserBody = currentUserResponse.body as {
    user: { username: string };
  };

  expect(currentUserBody.user.username).toBe(testUsername);
}

async function expectLogoutInvalidates(
  cookie: string,
  userId: string,
): Promise<void> {
  await request(app.getHttpServer())
    .post('/auth/logout')
    .set('Cookie', cookie)
    .expect(204);
  await request(app.getHttpServer())
    .get('/auth/me')
    .set('Cookie', cookie)
    .expect(401);
  await expect(prisma.session.count({ where: { userId } })).resolves.toBe(0);
}
