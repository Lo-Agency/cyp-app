import { db } from "../../utils/db.js";

export const getReportData = async () => {
  const transactions = await db.transaction.findMany();
  const budget = await db.budget.findFirst();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const deficit = budget ? budget.amount - expense : 0;

  const lineChart = transactions.map((t) => ({
    name: new Date(t.date).toLocaleDateString("fa-IR"),
    value: t.amount,
  }));

  const barChart = transactions
    .filter((t) => t.type === "income")
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
