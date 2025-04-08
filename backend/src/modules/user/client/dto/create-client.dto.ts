import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateClientDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsOptional()
  addressId: number | null;
}