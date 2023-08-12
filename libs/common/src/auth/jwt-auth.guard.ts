import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const jwtToken = context.switchToHttp().getRequest().cookies?.Authentication;

    if (jwtToken) {
      return true;
    }
  }
}
