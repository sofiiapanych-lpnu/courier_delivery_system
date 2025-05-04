import { Module } from '@nestjs/common';
import { DeliveryResolver } from './delivery.resolver';
import { DeliveryService } from './delivery.service';

@Module({
  providers: [DeliveryResolver, DeliveryService],
})
export class DeliveryModule_ { }
