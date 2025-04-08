import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { VehicleService } from 'src/modules/vehicle/vehicle.service';

@Module({
  controllers: [],
  providers: [VehicleService],
  exports: [CourierService],
})
export class CourierModule { }
