import { IsInt, IsPositive } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  shiftId: number;
}
