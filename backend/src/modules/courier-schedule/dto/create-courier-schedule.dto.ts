import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateCourierWeeklyScheduleDto } from "src/modules/courier-weekly-schedule/dto/create-courier-weekly-schedule.dto";

export class CreateCourierScheduleDto {
  @IsInt()
  courierId: number;

  @IsString()
  scheduleStatus: string;

  @ValidateNested()
  @Type(() => CreateDayScheduleDto)
  weeklySchedule?: CreateDayScheduleDto[];
}

export class CreateDayScheduleDto {
  @IsInt()
  dayOfWeek: number;

  @IsBoolean()
  isWorkingDay: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}