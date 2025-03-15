import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType, TransactionStatus, FinancialGoal, Filter } from '../types';
import { supabase } from '../lib/supabase';

interface TransactionContextType {
  transactions: Transaction[];
  goals: FinancialGoal[];
  filter: Filter;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransactionStatus: (id: string, status: Transaction['status']) => Promise<void>;
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => Promise<void>;
  updateGoalProgress: (id: string, amount: number) => Promise<void>;
  setFilter: (filter: Filter) => void;
  filteredTransactions: Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  isLoading: boolean;
  error: string | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

const initialFilter: Filter = {
  type: 'all',
  status: 'all',
  category: 'all',
  dateFrom: null,
  dateTo: null,
  period: 'all'
};

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('dueDate', { ascending: true });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      setError('Failed to fetch goals');
      console.error('Error:', err);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [...prev, data]);
    } catch (err) {
      setError('Failed to add transaction');
      console.error('Error:', err);
    }
  };

  const updateTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updatedTransaction)
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id
            ? { ...updatedTransaction, id }
            : transaction
        )
      );
    } catch (err) {
      setError('Failed to update transaction');
      console.error('Error:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('Error:', err);
    }
  };

  const updateTransactionStatus = async (id: string, status: Transaction['status']) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id
            ? { ...transaction, status }
            : transaction
        )
      );
    } catch (err) {
      setError('Failed to update transaction status');
      console.error('Error:', err);
    }
  };

  const addGoal = async (goal: Omit<FinancialGoal, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([goal])
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => [...prev, data]);
    } catch (err) {
      setError('Failed to add goal');
      console.error('Error:', err);
    }
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const newAmount = Math.min(goal.targetAmount, goal.currentAmount + amount);

      const { error } = await supabase
        .from('goals')
        .update({ currentAmount: newAmount })
        .eq('id', id);

      if (error) throw error;
      setGoals(prev =>
        prev.map(g =>
          g.id === id
            ? { ...g, currentAmount: newAmount }
            : g
        )
      );
    } catch (err) {
      setError('Failed to update goal progress');
      console.error('Error:', err);
    }
  };

  const getTransactionById = (id: string) => {
    return transactions.find(transaction => transaction.id === id);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type !== 'all' && transaction.type !== filter.type) return false;
    if (filter.status !== 'all' && transaction.status !== filter.status) return false;
    if (filter.category !== 'all' && transaction.category !== filter.category) return false;
    if (filter.dateFrom && new Date(transaction.dueDate) < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && new Date(transaction.dueDate) > new Date(filter.dateTo)) return false;
    return true;
  });

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        goals,
        filter,
        filteredTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateTransactionStatus,
        addGoal,
        updateGoalProgress,
        setFilter,
        getTransactionById,
        isLoading,
        error
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
