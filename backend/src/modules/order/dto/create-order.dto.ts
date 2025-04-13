import { IsString, IsNumber, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  cost: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
