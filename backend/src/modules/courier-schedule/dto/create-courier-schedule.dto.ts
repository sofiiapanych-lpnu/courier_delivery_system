import { Type } from "class-transformer";
import { IsInt, IsString, ValidateNested } from "class-validator";
import { CreateCourierWeeklyScheduleDto } from "src/modules/courier-weekly-schedule/dto/create-courier-weekly-schedule.dto";

export class CreateCourierScheduleDto {
  @IsInt()
  courierId: number;

  @IsString()
  scheduleStatus: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCourierWeeklyScheduleDto)
  weeklySchedule?: {
    dayOfWeek: number;
    isWorkingDay: boolean;
    startTime: string | null;
    endTime: string | null;
  }[];

}
