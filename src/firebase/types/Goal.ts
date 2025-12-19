export type GoalType = {
  title: string;
  content: string;
  pinned: boolean;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
};
