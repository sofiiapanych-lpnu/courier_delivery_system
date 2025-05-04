import { Resolver, Query, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client_ } from './client.entity';
import { User_ } from '../user/user.entity';
import { Address_ } from '../address/address.entity';

@Resolver(() => Client_)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) { }

  @Query(() => [Client_])
  async clients() {
    return this.clientService.findAll();
  }

  @Query(() => Client_)
  async client(@Args('client_id', { type: () => Int }) client_id: number) {
    return this.clientService.findOne(client_id);
  }

  @ResolveField(() => User_)
  user(@Parent() client: Client_) {
    return client.user;
  }

  @ResolveField(() => Address_, { nullable: true })
  address(@Parent() client: Client_) {
    return client.address;
  }
}
