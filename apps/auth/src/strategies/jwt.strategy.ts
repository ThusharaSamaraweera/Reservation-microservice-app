import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // protected readonly logger: Logger;
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const jwtToken =
            request?.cookies?.Authentication || // Get Jwt token from cookie for browser requests
            request?.Authentication; // Get Jwt token from message pattern for microservice requests

          if (!jwtToken) {
            console.log(`JwtStrategy: No jwt token found`);
            return null;
          }
          console.log(`JwtStrategy: Found jwt token`);
          return jwtToken;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate({ userId }: TokenPayload) {
    // this.logger.log(`Called validate jwt strategy: userId - ${userId}`);
    console.log(`JwtStrategy: Called validate jwt strategy: userId - ${userId}`);
    return this.usersService.getUser({ _id: userId });
  }
}
