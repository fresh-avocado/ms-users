import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as FastifyRequest;

    const sessionId = req.cookies['sessionId'];

    if (sessionId === null || sessionId === undefined) {
      throw new BadRequestException('unauthenticated');
    }

    const unsignedCookie = req.unsignCookie(sessionId);

    if (unsignedCookie.valid === false) {
      throw new BadRequestException('bad session id');
    }

    return true;
  }
}
