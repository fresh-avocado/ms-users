import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  const config = app.get(ConfigService);
  logger.log('BOOTSTRAPIN');
  // TODO: crear usuario admin que se encarga de crear los siguientes usuarios de tipo ONROAD
  await app.register(fastifyCookie, {
    secret: config.get<string>('COOKIE_SECRET'),
  });
  await app.listen(3001);
}
bootstrap();
