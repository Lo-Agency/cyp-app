export interface ITransaction{
  id: number;
  category: string;
  amount: number;
  date: Date ;
  type: "INCOME" | "EXPENSE";
};