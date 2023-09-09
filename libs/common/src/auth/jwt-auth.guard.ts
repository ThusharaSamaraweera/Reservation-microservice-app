import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '..';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // protected readonly logger: Logger;
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log(`Called JwtAuthGuard`);
    const jwtToken = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwtToken) {
      console.log(`No jwt token found`);
      return false;
    }
    console.log(`Validating jwt token`);
    // validate jwt token with auth service
    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwtToken,
      })
      .pipe(
        tap((res) => {
          console.log(`User authenticated`);
          context.switchToHttp().getRequest().user = res; // set user to request
        }),
        map(() => true), // return true if user is authenticated
        catchError(() => of(false)),
      );
  }
}
