import { IsString, IsPhoneNumber, IsInt } from "class-validator";

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  @IsPhoneNumber()
  contactNumber: string;

  @IsInt()
  addressId: number;
}
