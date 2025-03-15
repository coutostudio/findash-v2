export type TransactionStatus = 'pending' | 'paid' | 'overdue';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: TransactionStatus;
  type: TransactionType;
  category?: string;
}

export type GoalType = 'one-time' | 'installment';

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: GoalType;
  installments?: number;
  installmentAmount?: number;
}

export interface Filter {
  type: TransactionType | 'all';
  status: TransactionStatus | 'all';
  category: string | 'all';
  dateFrom: string | null;
  dateTo: string | null;
  period?: string;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  dueDate: string;
  type: TransactionType;
  status: TransactionStatus;
  category: string;
}
