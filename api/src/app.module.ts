import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlsModule } from './urls/urls.module';
import databaseConfig from '@config/database.config';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    UrlsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
