import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Address, Client, Courier, Order, Vehicle, Warehouse } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Warehouse_ } from '../../warehouse/warehouse.entity'
import { Address_ } from 'src/graphql/address/address.entity';
import { Order_ } from 'src/graphql/order/order.entity';
import { Client_ } from 'src/graphql/client/client.entity';
import { Courier_ } from 'src/graphql/courier/courier.entity';
import { Vehicle_ } from 'src/graphql/vehicle/vehicle.entity';

@ObjectType()
export class Delivery {
  @Field(() => ID)
  delivery_id: number;

  @Field()
  order_id: number;

  @Field({ nullable: true })
  courier_id?: number;

  @Field({ nullable: true })
  client_id?: number;

  @Field()
  address_id: number;

  @Field()
  delivery_type: string;

  @Field(() => Float)
  delivery_cost: Decimal;

  @Field()
  payment_method: string;

  @Field()
  delivery_status: string;

  @Field({ nullable: true })
  start_time?: Date;

  @Field({ nullable: true })
  end_time?: Date;

  @Field(() => Float, { nullable: true })
  desired_duration?: Decimal;

  @Field()
  warehouse_id: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => Warehouse_)
  warehouse: Warehouse;

  @Field(() => Warehouse_)
  address: Address;

  @Field(() => Address_)
  Address: Address;

  @Field(() => Order_)
  order: Order;

  @Field(() => Client_)
  Client: Client;

  @Field(() => Courier_)
  courier: Courier;

  @Field(() => Vehicle_)
  vehicle: Vehicle;
}
