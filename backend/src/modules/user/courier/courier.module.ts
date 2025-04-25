import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
import { VehicleModule } from 'src/modules/vehicle/vehicle.module';
import { DeliveryModule } from 'src/modules/delivery/delivery.module';
import { DeliveryService } from 'src/modules/delivery/delivery.service';
import { FeedbackModule } from 'src/modules/feedback/feedback.module';
import { FeedbackService } from 'src/modules/feedback/feedback.service';
import { CourierScheduleModule } from 'src/modules/courier-schedule/courier-schedule.module';
import { CourierScheduleService } from 'src/modules/courier-schedule/courier-schedule.service';

@Module({
  imports: [VehicleModule, DeliveryModule, FeedbackModule, CourierScheduleModule],
  controllers: [CourierController],
  providers: [CourierService, DeliveryService, FeedbackService, CourierScheduleService],
  exports: [CourierService],
})
export class CourierModule { }
