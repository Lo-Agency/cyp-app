import { db } from "../../utils/db";

export const createGoal = async ({
  title,
  targetAmount,
  currentAmount,
  deadline,
  userId,
}) => {
  if (!title) throw new Error("عنوان هدف الزامی است");
  if (!targetAmount || targetAmount <= 0) throw new Error("مبلغ هدف باید مثبت باشد");
  if (currentAmount < 0) throw new Error("مبلغ جمع‌آوری‌شده نمی‌تواند منفی باشد");
  if (!deadline) throw new Error("مهلت الزامی است");
  if (!userId) throw new Error("شناسه کاربر الزامی است");

  return db.goal.create({
    data: {
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline: new Date(deadline),
      user: {
        connect: { id: userId },
      },
    },
  });
};

export const getUserGoals = async (userId) => {
  return db.goal.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });
};

export const updateGoal = async (id, userId, {
  title,
  targetAmount,
  currentAmount,
  deadline,
}) => {
  if (!title) throw new Error("عنوان هدف الزامی است");
  if (!targetAmount || targetAmount <= 0) throw new Error("مبلغ هدف باید مثبت باشد");
  if (currentAmount < 0) throw new Error("مبلغ جمع‌آوری‌شده نمی‌تواند منفی باشد");
  if (!deadline) throw new Error("مهلت الزامی است");

  return db.goal.update({
    where: { id, userId },
    data: {
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline: new Date(deadline),
    },
  });
};

export const deleteGoal = async (id, userId) => {
  return db.goal.delete({
    where: { id, userId },
  });
};