import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateVehicleDto } from "src/modules/vehicle/dto";

export class CreateCourierDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  // @IsString()
  // @IsNotEmpty()
  // licensePlate: string;

  @ValidateNested()
  @Type(() => CreateVehicleDto)  // Це важливо для трансформації
  vehicle: CreateVehicleDto;
}