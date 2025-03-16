
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/lib/types';
import { generateId } from '@/lib/financeUtils';
import { toast } from '@/hooks/use-toast';
import AnimatedWrapper from './AnimatedWrapper';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
  className?: string;
}

const TransactionForm = ({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
  className
}: TransactionFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [errors, setErrors] = useState({
    description: '',
    amount: '',
    date: '',
  });

  // Reset form when editing transaction changes
  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setDate(new Date(editingTransaction.date));
      setType(editingTransaction.type);
    } else {
      setDescription('');
      setAmount('');
      setDate(new Date());
      setType('expense');
    }
    setErrors({
      description: '',
      amount: '',
      date: '',
    });
  }, [editingTransaction]);

  const validateForm = (): boolean => {
    const newErrors = {
      description: '',
      amount: '',
      date: '',
    };
    let isValid = true;

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
      isValid = false;
    }

    if (!date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData: Transaction = {
      id: editingTransaction ? editingTransaction.id : generateId(),
      description,
      amount: Number(amount),
      date: date as Date,
      type,
      createdAt: editingTransaction ? editingTransaction.createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (editingTransaction) {
      onUpdateTransaction(transactionData);
      toast({
        title: "Transaction updated",
        description: "Your transaction has been successfully updated."
      });
    } else {
      onAddTransaction(transactionData);
      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully added."
      });
    }

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date());
    setType('expense');
  };

  return (
    <AnimatedWrapper 
      delay={100}
      className={cn('bg-card rounded-2xl border border-border p-6 shadow-sm', className)}
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium">
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {editingTransaction ? 'Update your transaction details below' : 'Enter your transaction details below'}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Groceries, Salary, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? 'border-finance-expense' : ''}
            />
            {errors.description && (
              <p className="text-sm text-finance-expense">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={errors.amount ? 'border-finance-expense' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-finance-expense">{errors.amount}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-finance-expense"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-finance-expense">{errors.date}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as 'expense' | 'income')}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button type="submit" className="flex-1">
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            {editingTransaction && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </AnimatedWrapper>
  );
};

export default TransactionForm;
