
import React from 'react';
import { cn } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MonthlyData } from '@/lib/types';
import { formatCurrency } from '@/lib/financeUtils';
import AnimatedWrapper from './AnimatedWrapper';

interface ExpensesChartProps {
  data: MonthlyData[];
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="font-medium text-sm">{label}</p>
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-sm text-finance-expense">
            Expenses: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-finance-income">
            Income: {formatCurrency(payload[1].value)}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const ExpensesChart = ({ data, className }: ExpensesChartProps) => {
  return (
    <AnimatedWrapper 
      delay={300}
      className={cn('bg-card rounded-2xl border border-border p-6 shadow-sm', className)}
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium">Monthly Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track your expenses and income over time
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.3 }} />
            <Legend verticalAlign="top" align="right" />
            <Bar 
              name="Expenses" 
              dataKey="expenses" 
              radius={[4, 4, 0, 0]}
              barSize={20} 
              fill="hsl(var(--finance-expense))" 
            />
            <Bar 
              name="Income" 
              dataKey="income" 
              radius={[4, 4, 0, 0]} 
              barSize={20} 
              fill="hsl(var(--finance-income))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnimatedWrapper>
  );
};

export default ExpensesChart;
