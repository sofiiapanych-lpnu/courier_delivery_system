import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User_ {
  @Field(() => ID)
  user_id: number;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  role: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
