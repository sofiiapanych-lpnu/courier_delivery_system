import { IsInt, Min, Max, IsString } from "class-validator";

export class CreateFeedbackDto {
  @IsInt()
  clientId: number;

  @IsInt()
  courierId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
