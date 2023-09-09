import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async notifyEmail(email: string, message: string) {
    console.log(`Sending email to ${email} with message: ${message}`);
  }
}
