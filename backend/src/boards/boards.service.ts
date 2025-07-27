import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async getBoards(userId: string) {
    return this.prisma.board.findMany({ where: { userId } });
  }

  async createBoard(userId: string, name: string) {
    return this.prisma.board.create({
      data: { name, userId },
    });
  }
}
