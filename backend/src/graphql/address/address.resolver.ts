import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address_ } from './address.entity';
import { CreateAddressInput } from './dto/create-address.input';

@Resolver(() => Address_)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) { }

  @Query(() => [Address_])
  async addresses() {
    return this.addressService.findAll();
  }

  @Query(() => Address_)
  async address(@Args('address_id', { type: () => Int }) address_id: number) {
    return this.addressService.findOne(address_id);
  }

  @Mutation(() => Address_)
  async createAddress(@Args('data') data: CreateAddressInput) {
    return this.addressService.create(data);
  }
}
