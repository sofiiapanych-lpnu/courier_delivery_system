import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User_ } from '../user/user.entity';
import { Address_ } from '../address/address.entity';
import { Address, User } from '@prisma/client';

@ObjectType()
export class Client_ {
  @Field(() => ID)
  client_id: number;

  @Field()
  user_id: number;

  @Field({ nullable: true })
  address_id?: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => User_)
  user: User;

  @Field(() => Address_, { nullable: true })
  address?: Address;
}
