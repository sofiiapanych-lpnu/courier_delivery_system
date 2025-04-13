import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
import { VehicleModule } from 'src/modules/vehicle/vehicle.module';
import { DeliveryModule } from 'src/modules/delivery/delivery.module';
import { DeliveryService } from 'src/modules/delivery/delivery.service';

@Module({
  imports: [VehicleModule, DeliveryModule],
  controllers: [CourierController],
  providers: [CourierService, DeliveryService],
  exports: [CourierService],
})
export class CourierModule { }
