import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BoardsModule,
    TasksModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
