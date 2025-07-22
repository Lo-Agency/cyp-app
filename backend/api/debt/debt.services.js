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
      paidAmount: 0,
      remainingAmount: amount,
      interestRate: interestRate || 0,
      dueDate: new Date(dueDate),
      creditor,
      user: {
        connect: { id: userId },
      },
    },
  });
};

export const getUserDebts = async (userId) => {
  const debts = await db.debt.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });
  return debts.map((debt) => ({
    ...debt,
    isDueSoon: new Date(debt.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }));
};

export const updateDebt = async (id, userId, {
  title,
  amount,
  paidAmount,
  interestRate,
  dueDate,
  creditor,
}) => {
  if (!title) throw new Error("عنوان بدهی الزامی است");
  if (!amount || amount <= 0) throw new Error("مبلغ بدهی باید مثبت باشد");
  if (paidAmount < 0) throw new Error("مبلغ پرداخت‌شده نمی‌تواند منفی باشد");
  if (interestRate < 0) throw new Error("نرخ سود نمی‌تواند منفی باشد");
  if (!dueDate) throw new Error("مهلت الزامی است");
  if (!creditor) throw new Error("نام بستانکار الزامی است");

  return db.debt.update({
    where: { id, userId },
    data: {
      title,
      amount,
      paidAmount: paidAmount || 0,
      interestRate: interestRate || 0,
      dueDate: new Date(dueDate),
      creditor,
    },
  });
};

export const payDebtInstallment = async (id, userId, { paymentAmount }) => {
  if (!paymentAmount || paymentAmount <= 0) throw new Error("مبلغ پرداخت باید مثبت باشد");

  const debt = await db.debt.findUnique({
    where: { id, userId },
  });
  if (!debt) throw new Error("بدهی یافت نشد");

  const newPaidAmount = debt.paidAmount + paymentAmount;
  if (newPaidAmount > debt.amount) throw new Error("مبلغ پرداخت‌شده نمی‌تواند بیشتر از بدهی باشد");

  return db.debt.update({
    where: { id, userId },
    data: {
      paidAmount: newPaidAmount,
    },
  });
};


export const deleteDebt = async (id, userId) => {
  return db.debt.delete({
    where: { id, userId },
  });
};
