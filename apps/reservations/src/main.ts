import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser()); // parse cookies before the request reaches the controllers
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties from DTOs
    }),
  );
  app.useLogger(app.get(Logger)); // use the pino logger created in the LoggerModule
  const configService = app.get(ConfigService);
  const port = configService.get('RESERVATION_HTTP_PORT');
  await app.listen(port, () => {
    console.log(`🚀 Listening at http://localhost:${port}/reservations`);
  });
}
bootstrap();
