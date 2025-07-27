import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getBoards(@Req() req) {
    return this.boardsService.getBoards(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBoard(@Req() req, @Body('name') name: string) {
    return this.boardsService.createBoard(req.user.userId, name);
  }
}
