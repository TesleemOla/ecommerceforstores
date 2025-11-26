import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterCustomerDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  fullName!: string;
}
