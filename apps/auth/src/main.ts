import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser()); // parse cookies before the request reaches the controllers
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties from DTOs
    }),
  );
  app.useLogger(app.get(Logger)); // use the pino logger created
  // connect to the microservice
  app.connectMicroservice({
    transport: Transport.TCP, // transport protocol
    options: {
      host: AUTH_SERVICE,
      port: configService.get('AUTH_TCP_PORT'),
    },
  });
  await app.startAllMicroservices(); // start the microservice
  const port = configService.get('AUTH_HTTP_PORT');
  await app.listen(port, () => {
    console.log(`🚀 Auth service listening at http://localhost:${port}`);
  });
}
bootstrap();
