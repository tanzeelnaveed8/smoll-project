import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Logger } from 'src/configs/logger';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = Logger.getInstance();
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    });

    this.redis.on('error', (err) => {
      // ioredis emits "error" frequently when Redis is down; avoid crashing the process
      this.logger.error(`[LOG: REDIS] ${err?.message ?? err}`);
    });
  }

  // Save a value to Redis
  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (expirySeconds) {
      await this.redis.set(key, value, 'EX', expirySeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  // Get a value from Redis
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  // Delete a key from Redis
  async delete(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  // Set with JSON value (convenience method)
  async setJson(
    key: string,
    value: any,
    expirySeconds?: number,
  ): Promise<void> {
    await this.set(key, JSON.stringify(value), expirySeconds);
  }

  // Get and parse JSON value (convenience method)
  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  // Clean up Redis connection when app shuts down
  onModuleDestroy() {
    this.redis.disconnect();
  }
}
