import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export { prisma, disconnectPrisma };
