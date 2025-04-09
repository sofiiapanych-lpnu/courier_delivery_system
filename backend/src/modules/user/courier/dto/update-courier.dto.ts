import { Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { UpdateVehicleDto } from 'src/modules/vehicle/dto';

export class UpdateCourierDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateVehicleDto)
  vehicle?: UpdateVehicleDto;
}
