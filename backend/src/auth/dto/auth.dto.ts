import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsPhoneNumber() //@Matches(/^(\+?\d{10,15})$/, { message: 'Phone number is not valid' }) або @IsPhoneNumber('UA')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}