import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public readonly name!: string;

  @IsString()
  public readonly email!: string;
}
