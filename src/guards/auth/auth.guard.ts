import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { RedisService } from 'src/redis/redis.service';
import { Role } from './types/role.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly redis: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as FastifyRequest;

    const signedCookieValue = req.cookies['sessionId'];

    if (signedCookieValue === null || signedCookieValue === undefined) {
      throw new BadRequestException('unauthenticated');
    }

    const sessionIdObj = req.unsignCookie(signedCookieValue);

    if (sessionIdObj.valid === false) {
      throw new BadRequestException('bad session id');
    }

    const sessionId = sessionIdObj.value;

    const session = await this.redis.getSession(sessionId);

    const role = this.reflector.get<Role>('role', context.getHandler());

    if (role !== 'any' && session.userType !== role) {
      throw new HttpException({ msg: 'Unauthorized' }, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
