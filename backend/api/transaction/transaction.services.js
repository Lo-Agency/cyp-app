import { db } from "../../utils/db";

export const createTransaction = async ({
  title,
  amount,
  type,
  categoryId,
  userId,
  date,
}) => {
  console.log("Creating transaction:", {
    title,
    amount,
    type,
    categoryId,
    userId,
    date,
  });
  return db.transaction.create({
    data: {
      date,
      title,
      amount,
      type,
      category: {
        connect: { id: parseInt(categoryId) },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

export const getUserTransactions = async (userId) => {
  return db.transaction.findMany({
    where: { userId },
    include: {
      category: {
        select: { name: true },
      },
    },
  });
};
