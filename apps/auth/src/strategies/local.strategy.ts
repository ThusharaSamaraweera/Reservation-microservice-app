import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserService: UsersService) {
    super({ usernameField: 'email' });
  }

  // Note: Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
  async validate(email: string, password: string): Promise<any> {
    try {
      return await this.UserService.verifyUser(email, password);
    } catch (error) {
      throw error;
    }
  }
}
