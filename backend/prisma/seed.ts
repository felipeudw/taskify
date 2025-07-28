import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // bcryptjs is safer for cross-platform seeds

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting DB...');
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('testPaskiPass@12', 10);

  // 1. Create test user
  const user = await prisma.user.create({
    data: {
      email: 'testuser@taskify.app',
      password: passwordHash,
    },
  });

  // 2. Create a board for the user
  const board = await prisma.board.create({
    data: {
      name: 'E2E Test Board',
      userId: user.id,
    },
  });

  // 3. Create some sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design UI Mockups',
        priority: 'high',
        column: 'today',
        userId: user.id,
        boardId: board.id,
        order: 1,
      },
      {
        title: 'Prepare Meeting Notes',
        priority: 'medium',
        column: 'week',
        userId: user.id,
        boardId: board.id,
        order: 2,
      },
      {
        title: 'Update Documentation',
        priority: 'low',
        column: 'inbox',
        userId: user.id,
        boardId: board.id,
        order: 3,
      },
    ],
  });

  console.log('Seed complete: user + board + tasks created.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
