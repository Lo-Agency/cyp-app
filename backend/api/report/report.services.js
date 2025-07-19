import { db } from "../../utils/db.js";

export const getReportData = async (filter = "monthly") => {
  const now = new Date();
  let startDate;

  switch (filter) {
    case "daily":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6); // 7 روز اخیر
      break;
    case "weekly":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30); // 4 هفته اخیر
      break;
    case "monthly":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 5); // 6 ماه اخیر
      break;
    case "yearly":
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1); // یک سال اخیر
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 5);
  }

  // فیلتر کردن تراکنش‌ها بر اساس بازه زمانی
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: now,
      },
    },
  });

  const budget = await db.budget.findFirst();

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const deficit = budget ? budget.amount - expense : 0;

  const lineChart = transactions.map((t) => ({
    name: new Date(t.date).toLocaleDateString("fa-IR"),
    value: t.amount,
  }));

  const barChart = transactions
    .filter((t) => t.type === "INCOME")
    .map((t) => ({
      name: new Date(t.date).toLocaleDateString("fa-IR"),
      value: t.amount,
    }));

  const pieChart = [
    { name: "درآمد", value: income, color: "#00C49F" },
    { name: "هزینه", value: expense, color: "#FF8042" },
    { name: "بودجه", value: budget?.amount || 0, color: "#8884d8" },
  ];

  return {
    summary: {
      transactions: transactions.length,
      budget: budget?.amount || 0,
      income,
      expense,
      deficit,
    },
    lineChart,
    barChart,
    pieChart,
  };
};
