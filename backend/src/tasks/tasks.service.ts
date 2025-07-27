import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasksByBoard(boardId: string) {
    return this.prisma.task.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    // Find max order in the same board & column
    const lastTask = await this.prisma.task.findFirst({
      where: { boardId: dto.boardId, column: dto.column },
      orderBy: { order: 'desc' },
    });

    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    return this.prisma.task.create({
      data: {
        title: dto.title,
        priority: dto.priority,
        column: dto.column,
        order: nextOrder,
        boardId: dto.boardId,
        userId,
      },
    });
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data, // column, done, order supported
    });
  }

  async deleteTask(id: string) {
    try {
      const deleted = await this.prisma.task.delete({
        where: { id },
      });

      return { message: 'Task deleted successfully', deleted };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async reorderTasks(updates: { id: string; order: number }[]) {
    try {
      const transactions = updates.map((u) =>
        this.prisma.task.update({
          where: { id: u.id },
          data: { order: u.order },
        }),
      );

      await this.prisma.$transaction(transactions);
      return { message: 'Tasks reordered successfully' };
    } catch (error) {
      console.error('Reorder error details:', error);
      throw new Error('Reorder failed: ' + error.message);
    }
  }
}
