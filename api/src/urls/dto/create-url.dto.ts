import { IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsUrl({ require_tld: false })
  public readonly url!: string;
}
