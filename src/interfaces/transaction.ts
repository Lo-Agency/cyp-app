export interface ITransaction {
  categoryId: number;
  id: number;
  category: { name: string };
  amount: number;
  date: Date;
  type: "INCOME" | "EXPENSE";
  user?: { name: string };
}
