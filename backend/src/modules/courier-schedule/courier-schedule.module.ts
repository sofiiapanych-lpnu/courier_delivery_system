import { Module } from '@nestjs/common';
import { CourierScheduleService } from './courier-schedule.service';
import { CourierScheduleController } from './courier-schedule.controller';

@Module({
  controllers: [CourierScheduleController],
  providers: [CourierScheduleService],
})
export class CourierScheduleModule {}
