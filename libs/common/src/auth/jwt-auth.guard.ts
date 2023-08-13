import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const jwtToken = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwtToken) {
      return false;
    }

    // validate jwt token with auth service
    return this.authClient
      .send('authenticate', {
        Authentication: jwtToken,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res; // set user to request
        }),
        map(() => true), // return true if user is authenticated
      );
  }
}
