export interface ITransaction{
  id: number;
  category: string;
  amount: number;
  date: string;
  type: "INCOME" | "EXPENSE";
};