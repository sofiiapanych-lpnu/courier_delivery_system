import { PartialType } from '@nestjs/mapped-types';
import { CreateCourierWeeklyScheduleDto } from './create-courier-weekly-schedule.dto';

export class UpdateCourierWeeklyScheduleDto extends PartialType(CreateCourierWeeklyScheduleDto) {}
