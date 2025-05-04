import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Vehicle_ {
  @Field()
  license_plate: string;

  @Field()
  model: string;

  @Field()
  transport_type: string;

  @Field()
  is_company_owner: boolean;
}
