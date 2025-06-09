export interface ITransaction {
  id: number;
  category: { name: string };
  amount: number;
  date: Date;
  type: "INCOME" | "EXPENSE";
}
