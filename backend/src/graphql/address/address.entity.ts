import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Address_ {
  @Field(() => Int)
  address_id: number;

  @Field()
  street_name: string;

  @Field(() => Int)
  building_number: number;

  @Field(() => Int, { nullable: true })
  apartment_number?: number;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
