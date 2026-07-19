import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApplication } from './bootstrap';
import { positiveIntegerEnvironment } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  await app.listen(positiveIntegerEnvironment('API_PORT', 3001));
}

void bootstrap();
