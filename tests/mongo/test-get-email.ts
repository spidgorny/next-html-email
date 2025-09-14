import { PrismaClient } from '@generated/prisma';

import { runTest } from '../bootstrap';

const prisma = new PrismaClient();

void runTest(async () => {
  const emails = await prisma.mfilesEmail.findMany();
  console.log(emails);
});
