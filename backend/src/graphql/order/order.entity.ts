import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { Delivery } from '../delivery/entities/delivery.entity';

@ObjectType()
export class Order_ {
  @Field(() => ID)
  order_id: number;

  @Field()
  order_type: string;

  @Field()
  description: string;

  @Field(() => Float)
  cost: Decimal;

  @Field()
  payment_method: string;

  @Field(() => Float)
  weight: Decimal;

  @Field(() => Float)
  length: Decimal;

  @Field(() => Float)
  width: Decimal;

  @Field(() => Float)
  height: Decimal;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
