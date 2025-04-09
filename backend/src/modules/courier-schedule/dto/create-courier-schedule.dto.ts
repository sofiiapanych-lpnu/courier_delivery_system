import { IsInt, IsString } from "class-validator";

export class CreateCourierScheduleDto {
  @IsInt()
  courierId: number;

  @IsString()
  scheduleStatus: string;
}
