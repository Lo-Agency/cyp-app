export interface IGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | Date;
  userId: string;
  user: {
    id: string;
    name: string;
  };
}