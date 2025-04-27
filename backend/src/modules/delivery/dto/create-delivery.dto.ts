import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryDto {
  @IsInt()
  orderId: number;

  @IsOptional()
  @IsInt()
  courierId: number;

  @IsInt()
  clientId: number;

  @IsInt()
  addressId: number;

  @IsString()
  deliveryType: string;

  @Type(() => Number)
  @IsNumber()
  deliveryCost: number;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  deliveryStatus?: string;

  @IsOptional()
  @Type(() => Date)
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  endTime?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  desiredDuration?: number; // у годинах

  @IsInt()
  warehouseId: number;
}
