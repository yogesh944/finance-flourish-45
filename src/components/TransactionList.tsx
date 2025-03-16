
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FormattedTransaction } from '@/lib/types';
import TransactionCard from './ui/TransactionCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnimatedWrapper from './AnimatedWrapper';

interface TransactionListProps {
  transactions: FormattedTransaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
  className
}: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'expense' && transaction.type === 'expense') ||
      (filter === 'income' && transaction.type === 'income');

    return matchesSearch && matchesFilter;
  });

  return (
    <AnimatedWrapper 
      delay={200}
      className={cn('bg-card rounded-2xl border border-border p-6 shadow-sm', className)}
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium">Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Manage and view your transaction history
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default TransactionList;
