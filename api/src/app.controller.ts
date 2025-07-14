import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return {
      message: 'Welcome to DeepOrigin URL Shortener API!',
      version: '1.0.0',
    };
  }

  @Get('/health')
  health(): object {
    return {
      message: 'healthy',
    };
  }
}
