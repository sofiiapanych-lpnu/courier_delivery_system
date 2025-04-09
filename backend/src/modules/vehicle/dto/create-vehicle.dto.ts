import { IsString, Length, IsBoolean } from "class-validator";

export class CreateVehicleDto {
  @IsString()
  @Length(1, 20)
  licensePlate: string;

  @IsString()
  @Length(1, 50)
  model: string;

  @IsString()
  @Length(1, 20)
  transportType: string;

  @IsBoolean()
  isCompanyOwner: boolean;
}
