import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryModule]
})
export class DeliveryModule { }
