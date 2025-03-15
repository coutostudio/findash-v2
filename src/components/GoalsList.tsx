import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FinancialGoal, GoalType } from '../types';
import { Target, Plus, Calendar, Coins, ArrowRight } from 'lucide-react';
import GoalModal from './GoalModal';

const GoalsList: React.FC = () => {
  const { goals, updateGoalProgress } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getGoalTypeText = (type: GoalType) => {
    return type === 'one-time' ? 'À Vista' : 'Parcelado';
  };

  const handleAddProgress = (goalId: string, amount: number) => {
    updateGoalProgress(goalId, amount);
  };

  const handleOpenModal = (goal: FinancialGoal | null = null) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleQuickInstallmentUpdate = (goal: FinancialGoal) => {
    if (goal.type === 'installment' && goal.installmentAmount) {
      updateGoalProgress(goal.id, goal.installmentAmount);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-textPrimary relative">
          Suas Metas Financeiras
          <div className="absolute -inset-2 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-xl -z-10"></div>
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-1 text-primary hover:text-primary/80 relative"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-lg -z-10"></div>
          <Plus className="h-4 w-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-xl"></div>
            <Target className="h-12 w-12 mx-auto text-textSecondary relative z-10" />
          </div>
          <p className="mt-2 text-textSecondary">Você ainda não tem metas financeiras.</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 px-4 py-2 primary-button rounded-md hover:bg-primary/90 relative"
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/40 via-transparent to-transparent blur-lg rounded-md -z-10"></div>
            Criar Primeira Meta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progressPercentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            
            return (
              <div key={goal.id} className="bg-card/50 rounded-lg p-4 border border-cardBorder relative overflow-hidden">
                <div className="flex justify-between items-start relative">
                  <div>
                    <h4 className="font-medium text-textPrimary relative">
                      {goal.title}
                      <div className="absolute -inset-2 bg-gradient-radial from-primary/10 via-transparent to-transparent blur-lg -z-10"></div>
                    </h4>
                    <div className="flex items-center text-sm text-textSecondary mt-1">
                      <Target className="h-4 w-4 mr-1" />
                      <span>{getGoalTypeText(goal.type)}</span>
                      {goal.type === 'installment' && goal.installments && (
                        <span className="ml-1">
                          ({goal.installments} parcelas de {formatCurrency(goal.installmentAmount || 0)})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-textSecondary mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-textPrimary">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </div>
                    <div className="flex mt-1 justify-end">
                      {goal.type === 'installment' && goal.installmentAmount && (
                        <button
                          onClick={() => handleQuickInstallmentUpdate(goal)}
                          className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md mr-2 hover:bg-primary/20 flex items-center relative"
                        >
                          <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent blur-lg rounded-md -z-10"></div>
                          <ArrowRight className="h-3 w-3 mr-1" />
                          <span>Pagar Parcela ({formatCurrency(goal.installmentAmount)})</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenModal(goal)}
                        className="text-sm text-primary hover:text-primary/80 flex items-center relative"
                      >
                        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-lg -z-10"></div>
                        <Coins className="h-3 w-3 mr-1" />
                        <span>Outro Valor</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full progress-bar-bg rounded-full h-2.5">
                    <div 
                      className="progress-bar-fill h-2.5 rounded-full relative" 
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-primary/30 to-transparent blur-md rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-textSecondary mt-1">
                    {progressPercentage.toFixed(0)}% concluído
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={selectedGoal}
      />
    </div>
  );
};

export default GoalsList;
