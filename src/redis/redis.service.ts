import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { RedisClient } from './redis.module';
import { REDIS_CLIENT, SESSION_EXPIRATION_TIME } from './constants/constants';
import { ClientSession } from './types/session.type';
import crypto from 'crypto';
import { stringifyError } from 'src/utils/stringifyError';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  async createSession(value: ClientSession): Promise<string> {
    try {
      const existingSessions = await this.redis.exists(value.userEmail);
      if (existingSessions > 0) {
        const sessionId = await this.redis.get(value.userEmail);
        return sessionId;
      } else {
        const sessionId = crypto.randomUUID();
        await this.setSession(sessionId, value);
        return sessionId;
      }
    } catch (error) {
      this.logger.error(
        `could not create user session: ${stringifyError(error)}`,
      );
      throw new InternalServerErrorException('could not create user session');
    }
  }

  async setSession(key: string, value: ClientSession): Promise<void> {
    try {
      await this.redis
        .multi()
        .set(key, JSON.stringify(value), { EX: SESSION_EXPIRATION_TIME })
        .set(value.userEmail, key, { EX: SESSION_EXPIRATION_TIME })
        .exec();
    } catch (error) {
      this.logger.error(`could not set user session: ${stringifyError(error)}`);
      throw new InternalServerErrorException('could not set user session');
    }
  }

  async getSession(key: string): Promise<ClientSession> {
    let res: string | null;
    try {
      res = await this.redis.get(key);
    } catch (error) {
      this.logger.error(`could not get session: ${stringifyError(error)}`);
      throw new InternalServerErrorException('could not get session');
    }
    if (res === null) {
      throw new HttpException({ msg: 'Not signed in' }, HttpStatus.FORBIDDEN);
    }
    return JSON.parse(res) as ClientSession;
  }

  onModuleDestroy() {
    this.redis.quit();
  }
}
