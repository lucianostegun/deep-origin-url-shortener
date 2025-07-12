import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from '../../../src/urls/urls.service';
import { DataSource, Repository } from 'typeorm';
import { Url } from '@src/urls/entities/url.entity';

describe('UrlsService', () => {
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService, Repository<Url>, DataSource],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
