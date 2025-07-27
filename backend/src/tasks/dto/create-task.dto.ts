import { IsString, IsUUID, IsIn, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsUUID('4', { message: 'Invalid boardId format' })
  boardId: string;

  @IsIn(['low', 'medium', 'high'], {
    message: 'Priority must be low, medium, or high',
  })
  priority: 'low' | 'medium' | 'high';

  @IsIn(['inbox', 'today', 'week', 'upcoming'], {
    message: 'Column must be inbox, today, week, or upcoming',
  })
  column: 'inbox' | 'today' | 'week' | 'upcoming';
}
