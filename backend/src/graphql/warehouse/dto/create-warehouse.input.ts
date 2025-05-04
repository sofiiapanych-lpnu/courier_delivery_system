import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field()
  name: string;

  @Field()
  contactNumber: string;

  @Field(() => Int)
  addressId: number;
}
