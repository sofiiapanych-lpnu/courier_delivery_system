import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateCourierWeeklyScheduleDto {
  @IsInt()
  schedule_id: number;

  @IsInt()
  day_of_week: number;

  @IsOptional()
  @IsDateString()
  start_time?: string;

  @IsOptional()
  @IsDateString()
  end_time?: string;

  @IsBoolean()
  is_working_day: boolean;
}
