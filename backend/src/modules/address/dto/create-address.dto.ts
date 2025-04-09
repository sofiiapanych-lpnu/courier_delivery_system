import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  streetName: string;

  @IsInt()
  buildingNumber: number;

  @IsOptional()
  @IsInt()
  apartmentNumber?: number;

  @IsString()
  city: string;

  @IsString()
  country: string;
}
