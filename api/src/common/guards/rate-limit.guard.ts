import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom message
}

// In-memory storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.get<RateLimitConfig>('rateLimit', context.getHandler());

    if (!config) {
      return true; // If there is no config, allow
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId) {
      // If there is no user-id, block
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const key = `rate_limit:${userId}`;
    const now = Date.now();

    // Get or create entry for the user
    let userLimit = rateLimitStore.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      // New time window or first request
      userLimit = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, userLimit);
      return true;
    }

    if (userLimit.count >= config.maxRequests) {
      const resetInSeconds = Math.ceil((userLimit.resetTime - now) / 1000);
      throw new HttpException(config.message || `Rate limit exceeded. Try again in ${resetInSeconds} seconds.`, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Increment counter
    userLimit.count++;
    rateLimitStore.set(key, userLimit);

    return true;
  }
}

// Decorator to apply rate limiting
export const RateLimit = (config: RateLimitConfig) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('rateLimit', config, descriptor.value);
    }
  };
};
