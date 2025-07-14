import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    await app.init();
  });

  afterEach(async () => {
    // Clean up test data
    await userRepository.clear();
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      const createUserDto = {
        email: 'test1@example.com',
        name: 'Test User',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('publicId');
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });
  });

  describe('/users (GET)', () => {
    it('should return an empty array when no users exist', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should return array of users', async () => {
      // Create test users first
      const user1 = userRepository.create({
        email: 'user1@example.com',
        name: 'User 1',
        publicId: 'test-ulid-1',
      });
      const user2 = userRepository.create({
        email: 'user2@example.com',
        name: 'User 2',
        publicId: 'test-ulid-2',
      });

      await userRepository.save([user1, user2]);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('publicId');
          expect(res.body[0]).toHaveProperty('email');
          expect(res.body[0]).toHaveProperty('name');
        });
    });
  });

  describe('/users/:publicId (GET)', () => {
    it('should return a user by public id', async () => {
      const user = userRepository.create({
        email: 'test2@example.com',
        name: 'Test User',
        publicId: 'test-ulid',
      });

      const savedUser = await userRepository.save(user);

      return request(app.getHttpServer())
        .get(`/users/${savedUser.publicId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(savedUser.id);
          expect(res.body.publicId).toBe(savedUser.publicId);
          expect(res.body.email).toBe(savedUser.email);
          expect(res.body.name).toBe(savedUser.name);
        });
    });

    it('should return null for non-existent public id', () => {
      return request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBe(null);
        });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      const user = userRepository.create({
        email: 'test3@example.com',
        name: 'Test User',
        publicId: 'test-ulid',
      });

      const savedUser = await userRepository.save(user);

      return request(app.getHttpServer()).delete(`/users/${savedUser.id}`).expect(204);
    });
  });
});
