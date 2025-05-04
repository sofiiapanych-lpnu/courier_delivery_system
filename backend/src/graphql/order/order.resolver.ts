import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order_ } from './order.entity';

@Resolver(() => Order_)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) { }

  @Query(() => [Order_])
  orders() {
    return this.orderService.findAll();
  }

  @Query(() => Order_)
  order(@Args('order_id', { type: () => Int }) order_id: number) {
    return this.orderService.findOne(order_id);
  }
}
