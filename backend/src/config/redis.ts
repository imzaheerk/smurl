import Redis from 'ioredis';
import { env } from './env';

export const redisClient = new Redis({
  host: env.redis.host,
  port: env.redis.port
});

