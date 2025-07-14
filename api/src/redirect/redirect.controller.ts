import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlsService } from '../urls/urls.service';
import { Response } from 'express';

@Controller('r')
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const url = await this.urlsService.findBySlug(slug);

    if (!url) {
      // Instead of throwing an exception, redirect to a 404 page in the frontend
      return res.redirect(302, `/?error=not-found&slug=${slug}`);
    }

    await this.urlsService.incrementClickCount(url.publicId);
    return res.redirect(301, url.originalUrl);
  }
}
