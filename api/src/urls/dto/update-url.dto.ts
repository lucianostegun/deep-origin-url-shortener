import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @Matches(/^[a-zA-Z][a-zA-Z0-9]+$/, {
    message: 'Slug must start with a letter and contain only alphanumeric characters (a-z, A-Z, 0-9)',
  })
  public readonly slug!: string;
}
