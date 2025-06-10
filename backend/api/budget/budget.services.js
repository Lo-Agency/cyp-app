import { db } from "../../utils/db";

export const createBudget = async ({
  amount,
      categoryId,
      userId,
      spent,
      period,
}) => {
  if (!amount || amount <= 0) throw new Error("Amount must be positive");
  if (!categoryId) throw new Error("Category ID is required");
  if (!["monthly", "weekly", "yearly"].includes(period)) throw new Error("Invalid period");
  console.log("Creating budget:", {
   amount,
      categoryId,
      userId,
      spent,
      period,
  });
  return db.budget.create({
    data: {
      amount,
      spent,
      period,
      category: {
        connect: { id: parseInt(categoryId) },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

export const getUserBudgets = async (userId) => {
  return db.budget.findMany({
    where: { userId },
    include: {
      category: {
        select: { name: true },
      },
    },
  });
};
