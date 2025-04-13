import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateCourierWeeklyScheduleDto {
  @IsInt()
  scheduleId: number;

  @IsInt()
  dayOfWeek: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsBoolean()
  isWorkingDay: boolean;
}
