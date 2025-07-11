import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlsService.findOne(+id);
  }

  @Patch(':publicId')
  async update(
    @Param('publicId') publicId: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    if (await this.urlsService.slugExists(updateUrlDto.slug, publicId)) {
      throw new BadRequestException('Slug not available');
    }

    return this.urlsService.update(publicId, updateUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlsService.remove(+id);
  }
}
