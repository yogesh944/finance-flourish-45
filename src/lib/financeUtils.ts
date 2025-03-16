
import { Transaction, MonthlyData, FormattedTransaction } from './types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format amount as currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date as string
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Sort transactions by date (newest first)
export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Calculate total expenses
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate total income
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate net balance
export const calculateNetBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

// Group transactions by month for chart data
export const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyData: Record<string, MonthlyData> = {};
  
  // Get last 6 months
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleString('default', { month: 'short' });
    monthlyData[monthKey] = {
      month: monthName,
      expenses: 0,
      income: 0,
    };
  }
  
  // Fill in the data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (monthlyData[monthKey]) {
      if (transaction.type === 'expense') {
        monthlyData[monthKey].expenses += transaction.amount;
      } else {
        monthlyData[monthKey].income += transaction.amount;
      }
    }
  });
  
  // Convert to array and reverse (oldest first)
  return Object.values(monthlyData).reverse();
};

// Format transactions for display
export const formatTransactions = (transactions: Transaction[]): FormattedTransaction[] => {
  return transactions.map(transaction => ({
    ...transaction,
    formattedAmount: formatCurrency(transaction.amount),
    formattedDate: formatDate(transaction.date),
  }));
};

// Get sample transactions for initial state
export const getSampleTransactions = (): Transaction[] => {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  return [
    {
      id: generateId(),
      amount: 2000,
      date: new Date(today.getFullYear(), today.getMonth(), 1),
      description: 'Salary',
      type: 'income',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: generateId(),
      amount: 500,
      date: lastWeek,
      description: 'Rent',
      type: 'expense',
      createdAt: lastWeek,
      updatedAt: lastWeek,
    },
    {
      id: generateId(),
      amount: 50,
      date: today,
      description: 'Groceries',
      type: 'expense',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: generateId(),
      amount: 1800,
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
      description: 'Salary',
      type: 'income',
      createdAt: lastMonth,
      updatedAt: lastMonth,
    },
    {
      id: generateId(),
      amount: 100,
      date: lastMonth,
      description: 'Utilities',
      type: 'expense',
      createdAt: lastMonth,
      updatedAt: lastMonth,
    },
    {
      id: generateId(),
      amount: 30,
      date: lastMonth,
      description: 'Coffee Shop',
      type: 'expense',
      createdAt: lastMonth,
      updatedAt: lastMonth,
    },
    {
      id: generateId(),
      amount: 1800,
      date: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth(), 1),
      description: 'Salary',
      type: 'income',
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
    },
    {
      id: generateId(),
      amount: 200,
      date: twoMonthsAgo,
      description: 'Electronics',
      type: 'expense',
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
    }
  ];
};
