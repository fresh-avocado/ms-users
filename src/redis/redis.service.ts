import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { RedisClient } from './redis.module';
import { REDIS_CLIENT } from './constants/constants';
import { ClientSession } from './types/session.type';
import { stringifyError } from 'src/utils/stringifyError';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) { }

  async setSession(key: string, value: ClientSession): Promise<void> {
    // TODO: this.redis.expire(key, SESSION_EXPIRATION_TIME);
    try {
      await this.redis.hSet(key, value as Record<string, any>);
    } catch (error) {
      this.logger.error(
        `could not set session: ${JSON.stringify(error, null, 2)}`,
      );
      throw new Error('could not set session');
    }
  }

  async getSession(key: string): Promise<ClientSession> {
    try {
      return (await this.redis.hGetAll(key)) as unknown as ClientSession;
    } catch (error) {
      // TODO: detect when session does not exist, then say user's session expired
      this.logger.error(`could not get session: ${stringifyError(error)}`);
      throw new Error('could not get session');
    }
  }

  onModuleDestroy() {
    this.redis.quit();
  }
}
