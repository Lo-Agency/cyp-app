import { db } from "../../utils/db";
export const createDebt = async ({
  title,
  amount,
  interestRate,
  dueDate,
  creditor,
  userId,
}) => {
  if (!title) throw new Error("عنوان بدهی الزامی است");
  if (!amount || amount <= 0) throw new Error("مبلغ بدهی باید مثبت باشد");
  if (interestRate < 0) throw new Error("نرخ سود نمی‌تواند منفی باشد");
  if (!dueDate) throw new Error("مهلت الزامی است");
  if (!creditor) throw new Error("نام بستانکار الزامی است");
  if (!userId) throw new Error("شناسه کاربر الزامی است");

   return db.debt.create({
    data: {
      title,
      amount,
      interestRate: interestRate || 0,
      dueDate: new Date(deadline),
      creditor,
      user: {
        connect: { id: userId },
      },
    },
  });
  };

  export const getUserDebts = async (userId) => {
  return db.debt.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });
};

export const updateDebt = async (id, userId, {
  title,
  amount,
  interestRate,
  dueDate,
  creditor,
}) => {
  if (!title) throw new Error("عنوان بدهی الزامی است");
  if (!amount || amount <= 0) throw new Error("مبلغ بدهی باید مثبت باشد");
  if (interestRate < 0) throw new Error("نرخ سود نمی‌تواند منفی باشد");
  if (!dueDate) throw new Error("مهلت الزامی است");
  if (!creditor) throw new Error("نام بستانکار الزامی است");

  return db.debt.update({
    where: { id, userId },
    data: {
       title,
      amount,
      interestRate: interestRate || 0,
      dueDate: new Date(deadline),
      creditor,
    },
  });
};

export const deleteDebt = async (id, userId) => {
  return db.debt.delete({
    where: { id, userId },
  });
};
