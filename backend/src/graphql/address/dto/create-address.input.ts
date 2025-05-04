import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
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
}
