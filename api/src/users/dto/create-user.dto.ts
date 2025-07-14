import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;

  @IsEmail()
  @IsNotEmpty()
  public readonly email!: string;
}
