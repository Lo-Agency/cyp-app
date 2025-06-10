import { ICategory } from "./category";

export interface IBudget {
  id: string;
  category: ICategory; 
  categoryId: number;
  amount: number;
  spent: number;
  period: string;
  userId: string;
  user: { id: string; name: string };
}