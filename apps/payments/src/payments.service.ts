import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2023-08-16',
  });
  private readonly logger = new Logger(PaymentsService.name);
  constructor(private readonly configService: ConfigService) {}

  async createCharge({ card, amount }: CreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: '',
    //   card,
    // });

    // this.logger.log(`Payment method created ${paymentMethod.id}`);

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    this.logger.log(`Payment intent created ${paymentIntent.id}`);
    return paymentIntent;
  }
}
