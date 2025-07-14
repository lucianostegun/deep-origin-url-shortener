import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode, HttpStatus, Res, NotFoundException, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('urls')
@UseGuards(AuthGuard)
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @Get('redirect/:slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const url = await this.urlsService.findBySlug(slug);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlsService.incrementClickCount(url.publicId);
    return res.redirect(301, url.originalUrl);
  }
}
