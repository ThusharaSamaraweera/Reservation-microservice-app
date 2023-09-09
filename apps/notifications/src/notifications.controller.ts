import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  // private readonly logger = new Logger(NotificationsController.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify-email')
  async notifyEmail(@Payload() payload: NotifyEmailDto) {
    // this.logger.log(`Sending email to ${payload.email} with message ${payload.message}`);
    this.notificationsService.notifyEmail(payload.email, payload.message);
  }
}
