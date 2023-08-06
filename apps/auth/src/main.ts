import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties from DTOs
    }),
  );
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  const port = configService.get('AUTH_PORT');
  await app.listen(port, () => {
    console.log(`🚀 Auth service listening at http://localhost:${port}`);
  });
}
bootstrap();
