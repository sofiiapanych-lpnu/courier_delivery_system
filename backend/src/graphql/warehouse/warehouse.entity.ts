import { ObjectType, Field, Int } from '@nestjs/graphql';
//import { Address } from 'src/address/address.model';
import { DeliveryModule_ } from '../delivery/delivery.module';
import { Address, Delivery } from '@prisma/client';
import { Address_ } from '../address/address.entity';

@ObjectType()
export class Warehouse_ {
  @Field(() => Int)
  warehouse_id: number;

  @Field(() => Int)
  address_id: number;

  @Field()
  name: string;

  @Field()
  contact_number: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => Address_)
  address: Address;

  // @Field(() => [DeliveryModule_])
  // deliveries: Delivery[];
}
