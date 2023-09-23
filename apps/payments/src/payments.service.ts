import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';
import { NotifyEmailDto } from 'apps/notifications/src/dto/notify-email.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2023-08-16',
  });
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: ClientProxy,
  ) {}

  async createCharge({ amount, email }: PaymentCreateChargeDto) {
    // Note - this is needed for production
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: '',
    //   card,
    // });
    // this.logger.log(`Payment method created ${paymentMethod.id}`);
    this.logger.log(`Creating payment intent`);
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa', // Testing purposes
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    this.logger.log(`Payment intent created: payment intent id- ${paymentIntent.id}`);

    // Send notification to user
    this.notificationService.emit('notify-email', {
      email,
      message: `Your payment of $${amount} has completed successfully!`,
    });
    this.logger.log(`Notification sent to user ${email}`);
    return paymentIntent;
  }
}
