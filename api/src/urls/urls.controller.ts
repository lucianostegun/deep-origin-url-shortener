import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode, HttpStatus, NotFoundException, UseGuards, SetMetadata } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { RateLimitGuard, RateLimit } from '../common/guards/rate-limit.guard';

@Controller('urls')
@UseGuards(AuthGuard, RateLimitGuard)
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // Max 10 requests per minute
    message: 'Too many URLs created. Wait 1 minute before trying again.',
  })
  create(@Body() createUrlDto: CreateUrlDto, @CurrentUser() user: User) {
    return this.urlsService.create(createUrlDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.urlsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.urlsService.findOne(+id, user.id);
  }

  @Patch(':publicId')
  async update(@Param('publicId') publicId: string, @Body() updateUrlDto: UpdateUrlDto, @CurrentUser() user: User) {
    if (await this.urlsService.slugExists(updateUrlDto.slug, publicId)) {
      throw new BadRequestException('Slug not available');
    }

    return this.urlsService.update(publicId, updateUrlDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.urlsService.remove(+id, user.id);
  }

  @SetMetadata('skipGuard', true)
  @Get('redirect/:slug')
  async redirect(@Param('slug') slug: string) {
    const url = await this.urlsService.findBySlug(slug);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlsService.incrementClickCount(url.publicId);

    return {
      url: url.originalUrl,
    };
  }
}
