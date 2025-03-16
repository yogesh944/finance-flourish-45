
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Trash, Edit } from 'lucide-react';
import { FormattedTransaction } from '@/lib/types';
import ChipBadge from './ChipBadge';
import { Button } from './button';

interface TransactionCardProps {
  transaction: FormattedTransaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const TransactionCard = ({ 
  transaction, 
  onEdit, 
  onDelete,
  className 
}: TransactionCardProps) => {
  return (
    <div 
      className={cn(
        'w-full p-4 mb-3 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-md card-shine',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            transaction.type === 'expense' ? 'bg-finance-expense/10 text-finance-expense' : 'bg-finance-income/10 text-finance-income'
          )}>
            {transaction.type === 'expense' ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-foreground text-balance">
                {transaction.description}
              </h3>
              <ChipBadge 
                type={transaction.type === 'expense' ? 'error' : 'success'} 
                className="ml-2"
              >
                {transaction.type === 'expense' ? 'Expense' : 'Income'}
              </ChipBadge>
            </div>
            <p className="text-sm text-muted-foreground">{transaction.formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={cn(
            "font-medium",
            transaction.type === 'expense' ? 'text-finance-expense' : 'text-finance-income'
          )}>
            {transaction.type === 'expense' ? '-' : '+'}{transaction.formattedAmount}
          </span>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(transaction.id)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(transaction.id)}
              className="h-8 w-8 text-finance-expense"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
