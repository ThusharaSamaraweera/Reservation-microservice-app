import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: PAYMENT_SERVICE,
      port: configService.get('PAYMENTS_HTTP_PORT'),
    },
  });
  app.useLogger(app.get(Logger));
  const port = configService.get('PAYMENTS_HTTP_PORT');
  await app.listen(port, () => {
    console.log(`🚀 Payment service listening at http://localhost:${port}`);
  });
}
bootstrap();
