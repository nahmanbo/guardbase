// DTO for updating shift
import { IsOptional, IsString } from 'class-validator';

export class UpdateShiftDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  time?: string;
}
