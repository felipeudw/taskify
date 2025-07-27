import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':boardId')
  @ApiResponse({ status: 200, description: 'Get all tasks by board ID' })
  async getTasks(@Param('boardId') boardId: string) {
    return this.tasksService.getTasksByBoard(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  @ApiResponse({ status: 200, description: 'Tasks reordered successfully' })
  async reorderTasks(
    @Body() body: { updates: { id: string; order: number }[] },
  ) {
    return this.tasksService.reorderTasks(body.updates);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
