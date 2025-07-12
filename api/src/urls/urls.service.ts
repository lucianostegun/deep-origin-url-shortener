import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from './entities/url.entity';
import { ulid } from 'ulid';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    const publicId = ulid();
    let slug: string;

    do {
      slug = this.generateSlug();
    } while (await this.slugExists(slug));

    const url = this.urlRepository.create({
      publicId,
      originalUrl: createUrlDto.url,
      shortUrl: this.generateShortUrl(slug),
      slug,
      clickCount: 0,
    });

    return await this.urlRepository.save(url);
  }

  async findAll(): Promise<Url[]> {
    return await this.urlRepository.find();
  }

  async findOne(id: number): Promise<Url | null> {
    return await this.urlRepository.findOne({ where: { id } });
  }

  async findByPublicId(publicId: string): Promise<Url | null> {
    return await this.urlRepository.findOne({ where: { publicId } });
  }

  async update(
    publicId: string,
    updateUrlDto: UpdateUrlDto,
  ): Promise<Url | null> {
    const updateData: Partial<Url> = {};
    updateData.slug = updateUrlDto.slug;
    updateData.shortUrl = this.generateShortUrl(updateUrlDto.slug);

    await this.urlRepository.update({ publicId }, updateData);
    return await this.findByPublicId(publicId);
  }

  async remove(id: number): Promise<void> {
    await this.urlRepository.delete(id);
  }

  async incrementClickCount(publicId: string): Promise<void> {
    await this.urlRepository.increment({ publicId }, 'clickCount', 1);
  }

  async slugExists(slug: string, publicId?: string): Promise<boolean> {
    const count = await this.urlRepository.count({
      where: { slug, ...(publicId ? { publicId: Not(publicId) } : {}) },
    });

    return count > 0;
  }

  generateSlug(length: number = 6): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';

    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return slug;
  }

  generateShortUrl(slug: string): string {
    return process.env.SHORTED_DOMAIN + '/' + slug;
  }
}
