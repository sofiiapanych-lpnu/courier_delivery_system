import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
import { VehicleModule } from 'src/modules/vehicle/vehicle.module';

@Module({
  imports: [VehicleModule],
  controllers: [CourierController],
  providers: [CourierService],
  exports: [CourierService],
})
export class CourierModule { }
