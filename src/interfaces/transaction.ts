import { ICategory } from "./category";

export interface ITransaction {
  categoryId: number;
  id: number;
  category: ICategory;
  amount: number;
  date: Date;
  type: "INCOME" | "EXPENSE";
  user?: { name: string };
}
