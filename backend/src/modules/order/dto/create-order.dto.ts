import { IsString, IsNumber, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  cost: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsDecimal()
  weight: number;

  @IsDecimal()
  length: number;

  @IsDecimal()
  width: number;

  @IsDecimal()
  height: number;
}
