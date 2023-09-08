import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AUTH_SERVICE, DatabaseModule, LoggerModule, PAYMENT_SERVICE } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forfeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_DB_URL: Joi.string().required(),
        RESERVATION_HTTP_PORT: Joi.number().required(),
        PAYMENTS_TCP_PORT: Joi.number().required(),
        AUTH_TCP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: AUTH_SERVICE,
            port: configService.get('AUTH_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: PAYMENT_SERVICE,
            port: configService.get('PAYMENTS_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
