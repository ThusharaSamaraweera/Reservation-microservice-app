import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe()) // validate payload
  async createCharge(@Payload() { card, amount, email }: PaymentCreateChargeDto) {
    console.log(`Creating charge for ${email} for $${amount}`);
    return this.paymentsService.createCharge({ card, amount, email });
  }
}
