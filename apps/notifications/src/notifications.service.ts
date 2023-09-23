import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger = new Logger(NotificationsService.name);
  async notifyEmail(email: string, message: string) {
    this.logger.log(`Sending email to ${email} with message ${message}`);
  }
}
