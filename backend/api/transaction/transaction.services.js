import prisma from "../utils/db.js";

export const createTransaction = async ({
  amount,
  type,
  category,
  date,
  userId,
}) => {
  return prisma.transaction.create({
    data: {
      amount,
      type,
      category,
      date: new Date(date),
      userId,
    },
  });
};

export const getUserTransactions = async (userId) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};
