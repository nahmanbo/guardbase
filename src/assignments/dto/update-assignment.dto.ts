import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdateAssignmentDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  shiftId?: number;
}
