import {
  IsIn,
  IsOptional,
  IsInt,
  Min,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'], {
    message: 'Priority must be low, medium, or high',
  })
  priority?: string;

  @IsOptional()
  @IsIn(['inbox', 'today', 'week', 'upcoming'], {
    message: 'Invalid column value',
  })
  column?: string;

  @IsOptional()
  done?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
