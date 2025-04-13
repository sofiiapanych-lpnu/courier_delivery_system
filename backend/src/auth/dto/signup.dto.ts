import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator"
import { CreateVehicleDto } from "src/modules/vehicle/dto";

export class SignupDto {
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

  @ValidateNested()
  @Type(() => CreateVehicleDto)  // Це важливо для трансформації
  @IsOptional()
  vehicle?: CreateVehicleDto;
}