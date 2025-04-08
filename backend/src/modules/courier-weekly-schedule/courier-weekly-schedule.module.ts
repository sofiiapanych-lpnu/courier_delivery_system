import { Module } from '@nestjs/common';
import { CourierWeeklyScheduleService } from './courier-weekly-schedule.service';
import { CourierWeeklyScheduleController } from './courier-weekly-schedule.controller';

@Module({
  controllers: [CourierWeeklyScheduleController],
  providers: [CourierWeeklyScheduleService],
})
export class CourierWeeklyScheduleModule {}
