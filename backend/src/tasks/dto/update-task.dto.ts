import { IsIn, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsIn(['inbox', 'today', 'week', 'upcoming'])
  column?: string;

  @IsOptional()
  done?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
