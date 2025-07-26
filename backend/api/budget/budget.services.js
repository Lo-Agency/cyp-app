import { db } from "../../utils/db.js";

export const createBudget = async ({
  amount,
  categoryId,
  userId,
  spent,
  period,
}) => {
  if (!amount || amount <= 0) throw new Error("Amount must be positive");
  if (!categoryId) throw new Error("Category ID is required");
  if (!["monthly", "weekly", "yearly"].includes(period))
    throw new Error("Invalid period");
  console.log("Creating budget:", {
    amount,
    categoryId,
    userId,
    spent,
    period,
  });
  return db.Budget.create({
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
  return db.Budget.findMany({
    where: { userId },
    include: {
      category: {
        select: { name: true },
      },
    },
  });
};
export const updateBudget = async (id, userId, data) => {
  return db.budget.update({
    where: { id: parseInt(id), userId },
    data: {
      amount: data.amount,
      spent: data.spent,
      period: data.period,
      category: { connect: { id: parseInt(data.categoryId) } },
    },
  });
};

export const deleteBudget = async (id, userId) => {
  const budget = await db.budget.findUnique({
    where: { id: id, userId },
  });

  if (!budget) {
    throw new Error("بودجه پیدا نشد");
  }

  await db.budget.delete({
    where: { id: id },
  });

  return true;
};
