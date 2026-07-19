import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { requiredEnvironment } from './config/environment';

export function configureApplication(app: INestApplication): void {
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: requiredEnvironment('WEB_ORIGIN'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
}
