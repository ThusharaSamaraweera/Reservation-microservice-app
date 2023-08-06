import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/modal/user.schema';

@Injectable()
export class AuthService {
  async login(user: UserDocument, reponse: Response) {
    return user;
  }
}
