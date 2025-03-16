
export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'expense' | 'income';
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface FormattedTransaction extends Transaction {
  formattedAmount: string;
  formattedDate: string;
}
