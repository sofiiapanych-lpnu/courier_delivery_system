import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateDeliveryInput {
  @Field()
  order_id: number;

  @Field()
  address_id: number;

  @Field()
  delivery_type: string;

  @Field(() => Float)
  delivery_cost: number;

  @Field()
  payment_method: string;

  @Field()
  warehouse_id: number;

  @Field({ nullable: true })
  courier_id?: number;

  @Field({ nullable: true })
  client_id?: number;

  @Field({ nullable: true })
  start_time?: Date;

  @Field({ nullable: true })
  end_time?: Date;

  @Field(() => Float, { nullable: true })
  desired_duration?: number;
}
