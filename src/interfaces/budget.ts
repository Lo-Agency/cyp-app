import { ICategory } from "./category";

export enum BudgetPeriod {
  Monthly = "monthly",
  Weekly = "weekly",
  Yearly = "yearly",
}
export interface IBudget {
  id: string;
  category: ICategory; 
  categoryId: number;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  userId: string;
  user: { id: string; name: string };
}