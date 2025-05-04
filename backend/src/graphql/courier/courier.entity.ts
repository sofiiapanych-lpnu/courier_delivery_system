import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User_ } from '../user/user.entity';
import { Vehicle } from '@prisma/client';
import { Vehicle_ } from '../vehicle/vehicle.entity';

@ObjectType()
export class Courier_ {
  @Field(() => ID)
  courier_id: number;

  @Field()
  user_id: number;

  @Field()
  license_plate: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => User_)
  user: User_;

  @Field(() => Vehicle_)
  vehicle: Vehicle;
}
