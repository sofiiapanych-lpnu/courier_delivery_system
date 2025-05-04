import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse_ } from './warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';

@Resolver(() => Warehouse_)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) { }

  @Query(() => [Warehouse_])
  warehouses() {
    return this.warehouseService.findAll();
  }

  @Query(() => Warehouse_)
  warehouse(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Mutation(() => Warehouse_)
  createWarehouse(
    @Args('name') name: string,
    @Args('contact_number') contact_number: string,
    @Args('address_id', { type: () => Int }) address_id: number,
  ) {
    console.log(name, contact_number, address_id);
    return this.warehouseService.create({ name, contact_number, address_id });
  }
}
