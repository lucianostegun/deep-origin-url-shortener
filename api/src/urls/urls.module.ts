import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { Url } from './entities/url.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), UsersModule],
  controllers: [UrlsController],
  providers: [UrlsService, AuthGuard],
})
export class UrlsModule {}
