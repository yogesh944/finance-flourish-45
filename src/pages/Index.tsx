
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import ExpensesChart from '@/components/ExpensesChart';
import Header from '@/components/Header';
import { Transaction } from '@/lib/types';
import { 
  formatTransactions, 
  getMonthlyData, 
  calculateTotalExpenses, 
  calculateTotalIncome,
  calculateNetBalance, 
  sortTransactionsByDate,
  formatCurrency,
  getSampleTransactions
} from '@/lib/financeUtils';
import { toast } from '@/hooks/use-toast';
import ChipBadge from '@/components/ui/ChipBadge';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }));
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions(getSampleTransactions());
      }
    } else {
      // Load sample data for first-time users
      setTransactions(getSampleTransactions());
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted."
    });
  };

  const handleEditTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      
      // Scroll to form
      const formElement = document.getElementById('transaction-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const sortedTransactions = sortTransactionsByDate(transactions);
  const formattedTransactions = formatTransactions(sortedTransactions);
  const monthlyData = getMonthlyData(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  const netBalance = calculateNetBalance(transactions);

  return (
    <div className="min-h-screen bg-background antialiased">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <Header />
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <ArrowUpRight className="h-5 w-5 mr-2 text-finance-income" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
            </div>
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalIncome)}</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <ArrowDownLeft className="h-5 w-5 mr-2 text-finance-expense" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
            </div>
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalExpenses)}</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <Wallet className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Net Balance</h3>
            </div>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-foreground">{formatCurrency(netBalance)}</p>
              <ChipBadge 
                type={netBalance >= 0 ? 'success' : 'error'} 
                className="ml-2"
              >
                {netBalance >= 0 ? 'Positive' : 'Negative'}
              </ChipBadge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            {/* Transaction Form */}
            <div id="transaction-form">
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                editingTransaction={editingTransaction}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            
            {/* Chart */}
            <ExpensesChart data={monthlyData} />
          </div>
          
          {/* Transaction List */}
          <TransactionList
            transactions={formattedTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
