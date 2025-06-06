import { db } from "../../utils/db";

export const createTransaction = async ({
   title,
  amount,
  type,
  categoryId,
  userId,
  date,
}) => {
  return prisma.transaction.create({
    data: {
  title,
      amount,
      type,
      categoryId,
      userId,
      createdAt: date ? new Date(date) : undefined,
    },
  });
};

export const getUserTransactions = async (userId) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: {
      category: {
        select: { name: true },
      },
    },
  });
};
