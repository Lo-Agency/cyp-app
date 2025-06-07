import { db } from "../../utils/db";

export const createTransaction = async ({
   title,
  amount,
  type,
  categoryId,
  userId,

}) => {
  return db.transaction.create({
    data: {
  title,
      amount,
      type,
      categoryId,
      userId,
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
