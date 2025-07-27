import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasksByBoard(boardId: string) {
    return this.prisma.task.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }

  async reorderTasks(updates: { id: string; order: number }[]) {
    const promises = updates.map((u) =>
      this.prisma.task.update({
        where: { id: u.id },
        data: { order: u.order },
      }),
    );
    return Promise.all(promises);
  }
}
