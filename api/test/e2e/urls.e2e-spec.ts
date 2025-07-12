import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { UrlsModule } from '../../src/urls/urls.module';

describe('UrlsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UrlsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it('/urls (POST)', () => {
    return request(app.getHttpServer())
      .post('/urls')
      .expect(400)
      .expect({
        message: ['url must be a URL address', 'url must be a string'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });
});
