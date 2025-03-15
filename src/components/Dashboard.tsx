import React, { useState } from 'react';
import Summary from './Summary';
import TransactionList from './TransactionList';
import FilterPanel from './FilterPanel';
import ChartSection from './ChartSection';
import GoalsList from './GoalsList';
import TransactionModal from './TransactionModal';
import { useTransactions } from '../context/TransactionContext';

const Dashboard: React.FC = () => {
  const { filteredTransactions } = useTransactions();
  const [showFilters, setShowFilters] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate summary data
  const income = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // Separate transactions by type for charts
  const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Transaction Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-xl border border-cardBorder p-6">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Nova Transação</h2>
            <TransactionModal isOpen={true} onClose={() => {}} embedded={true} />
          </div>
          <GoalsList />
        </div>

        {/* Right Column - Data Display */}
        <div className="lg:col-span-8 space-y-6">
          <Summary 
            income={income}
            expense={expense}
            balance={balance}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />
          
          <div className="bg-card rounded-xl border border-cardBorder p-6">
            {showFilters && (
              <div className="mb-6">
                <FilterPanel />
              </div>
            )}
            <TransactionList transactions={filteredTransactions} />
          </div>

          <ChartSection 
            incomeData={incomeTransactions} 
            expenseData={expenseTransactions} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
