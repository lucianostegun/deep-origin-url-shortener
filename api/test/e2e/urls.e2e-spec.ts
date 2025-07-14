import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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

  it('/urls (POST) - should create URL and return publicId as id', () => {
    return request(app.getHttpServer())
      .post('/urls')
      .send({ url: 'https://www.example.com' })
      .expect(201)
      .then((response) => {
        const body: unknown = response.body;
        expect(body).toHaveProperty('id');
        expect(body).not.toHaveProperty('publicId');
        expect(body).toHaveProperty('originalUrl', 'https://www.example.com');
        expect(body).toHaveProperty('slug');
        expect(body).toHaveProperty('clickCount', 0);
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
      });
  });
});
