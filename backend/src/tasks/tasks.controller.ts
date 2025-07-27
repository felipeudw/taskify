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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':boardId')
  async getTasks(@Param('boardId') boardId: string) {
    return this.tasksService.getTasksByBoard(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(req.user.userId, dto);
  }

  // ✅ Place this BEFORE :id route
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  async reorderTasks(
    @Body() body: { updates: { id: string; order: number }[] },
  ) {
    return this.tasksService.reorderTasks(body.updates);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
