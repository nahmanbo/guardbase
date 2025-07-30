import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}
