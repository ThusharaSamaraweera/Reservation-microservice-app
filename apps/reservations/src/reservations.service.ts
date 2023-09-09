import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  private readonly logger: Logger = new Logger(ReservationsService.name);
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    this.logger.log(
      `Creating reservation ${JSON.stringify(createReservationDto)} for user ${userId}`,
    );
    return this.paymentService.send('create_charge', createReservationDto.charge).pipe(
      map((response) => {
        this.logger.log(`Creating reservation:  invoice id- ${response?.id}`);
        return this.reservationsRepository.create({
          ...createReservationDto,
          invoiceId: response.id,
          timestamp: new Date(),
          userId,
        });
      }),
    );
  }

  findAll() {
    this.logger.log(`Called find all reservations service`);
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    this.logger.log(`Called find one reservation service: id - ${_id}`);
    return this.reservationsRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    this.logger.log(
      `Called update reservation service: id - ${_id} update - ${JSON.stringify(
        updateReservationDto,
      )}`,
    );
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      {
        $set: updateReservationDto,
      },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
