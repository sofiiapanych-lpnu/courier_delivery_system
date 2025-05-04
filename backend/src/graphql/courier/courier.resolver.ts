import { Resolver, Query, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { CourierService } from './courier.service';
import { Courier_ } from './courier.entity';
import { User_ } from '../user/user.entity';
import { Vehicle_ } from '../vehicle/vehicle.entity';

@Resolver(() => Courier_)
export class CourierResolver {
  constructor(private readonly courierService: CourierService) { }

  @Query(() => [Courier_])
  async couriers() {
    return this.courierService.findAll();
  }

  @Query(() => Courier_)
  async courier(@Args('courier_id', { type: () => Int }) courier_id: number) {
    return this.courierService.findOne(courier_id);
  }

  @ResolveField(() => User_)
  user(@Parent() courier: Courier_) {
    return courier.user;
  }

  @ResolveField(() => Vehicle_)
  vehicle(@Parent() courier: Courier_) {
    return courier.vehicle;
  }
}
