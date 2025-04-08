import { PartialType } from '@nestjs/mapped-types';
import { CreateCourierScheduleDto } from './create-courier-schedule.dto';

export class UpdateCourierScheduleDto extends PartialType(CreateCourierScheduleDto) {}
