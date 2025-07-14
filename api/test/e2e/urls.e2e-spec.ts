import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { UrlsModule } from '../../src/urls/urls.module';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';

describe('UrlsController (e2e)', () => {
  let app: INestApplication<App>;
  let usersService: UsersService;
  let testUser: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UrlsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    usersService = app.get<UsersService>(UsersService);

    await app.init();

    testUser = await usersService.create({
      publicId: 'test-user-public-id',
      email: 'test-url@example.com',
      name: 'Test User',
    });
  });

  it('/urls (POST) - should return 401 when no user-id header', () => {
    return request(app.getHttpServer()).post('/urls').send({ url: 'https://www.example.com' }).expect(401).expect({
      message: 'User ID header is required',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/urls (POST) - should return 401 when invalid user-id header', () => {
    return request(app.getHttpServer()).post('/urls').set('user-id', 'invalid-user-id').send({ url: 'https://www.example.com' }).expect(401).expect({
      message: 'Invalid user ID',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/urls (POST) - should return 400 when no url provided', () => {
    return request(app.getHttpServer())
      .post('/urls')
      .set('user-id', testUser.publicId)
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
      .set('user-id', testUser.publicId)
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
