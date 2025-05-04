import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { Address_ } from '../address/address.entity';

@Resolver(() => Delivery)
export class DeliveryResolver {
  constructor(private readonly deliveryService: DeliveryService) { }

  @Query(() => [Delivery])
  async deliveries() {
    return this.deliveryService.findAll();
  }

  @Query(() => Delivery)
  async delivery(@Args('delivery_id', { type: () => Int }) delivery_id: number) {
    return this.deliveryService.findOne(delivery_id);
  }

  @Mutation(() => Delivery)
  async createDelivery(@Args('data') data: CreateDeliveryInput) {
    return this.deliveryService.create(data);
  }
}
