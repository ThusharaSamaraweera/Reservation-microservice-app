import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/modal/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }
}
