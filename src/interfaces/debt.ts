export interface IDebt {
  id: string;
  title: string;
  amount: number;
  interestRate: number;
  dueDate: string | Date;
  creditor: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
}