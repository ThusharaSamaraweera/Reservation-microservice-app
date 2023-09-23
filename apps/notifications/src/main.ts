import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { NOTIFICATION_SERVICE } from '@app/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: NOTIFICATION_SERVICE,
      port: configService.get('NOTIFICATIONS_TCP_PORT'),
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();

  console.log(
    `🚀 Notifications microservice is listening on ${NOTIFICATION_SERVICE}:${configService.get(
      'NOTIFICATIONS_TCP_PORT',
    )} (TCP)`,
  );
}
bootstrap();
