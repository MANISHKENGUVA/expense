export interface Person {
  id: string;
  name: string;
  totalPaid: number;
  totalOwed: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  sharedBy: string[];
  date: string;
}

export interface Sheet {
  id: string;
  name: string;
  totalExpenses: number;
  persons: Person[];
  expenses: Expense[];
}

export interface Balance {
  from: string;
  to: string;
  amount: number;
}
