import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { Url } from './entities/url.entity';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsersModule } from '../users/users.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), UsersModule],
  controllers: [UrlsController],
  providers: [UrlsService, AuthGuard, RateLimitGuard],
})
export class UrlsModule {}
