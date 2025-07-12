import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';

describe('UrlsService', () => {
  let service: UrlsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    increment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateShortUrlSlug', () => {
    it('should generate a 6 chars length string', () => {
      const slug = service['generateSlug']();

      expect(slug).toHaveLength(6);
    });

    it('should match a [A-Za-z0-9] pattern', () => {
      const slug = service['generateSlug']();

      expect(slug).toMatch(/^[A-Za-z0-9]+$/);
    });
  });

  describe('slugExists', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return true when slug exists', async () => {
      const slug = 'abc123';
      mockRepository.count.mockResolvedValue(1);

      const result = await service.slugExists(slug);

      expect(result).toBe(true);
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { slug },
      });
    });

    it('should return false when slug does not exist', async () => {
      const slug = 'xyz789';
      mockRepository.count.mockResolvedValue(0);

      const result = await service.slugExists(slug);

      expect(result).toBe(false);
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { slug },
      });
    });

    it('should return true when slug exists for different publicId', async () => {
      const slug = 'abc123';
      const publicId = 'current-public-id';
      mockRepository.count.mockResolvedValue(1);

      const result = await service.slugExists(slug, publicId);

      expect(result).toBe(true);
      expect(mockRepository.count).toHaveBeenCalledTimes(1);
    });

    it('should return false when slug only exists for the same publicId', async () => {
      const slug = 'abc123';
      const publicId = 'current-public-id';
      mockRepository.count.mockResolvedValue(0);

      const result = await service.slugExists(slug, publicId);

      expect(result).toBe(false);
      expect(mockRepository.count).toHaveBeenCalledTimes(1);
    });
  });
});
