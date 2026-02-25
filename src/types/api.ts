export interface Project {
  id: number;
  name: string;
  createdAt: string;
}

export interface Expense {
  id: number;
  projectId: number;
  expenseType: string;
  amount: number;
  description: string;
  createdAt: string;
}
