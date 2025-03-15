import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, DollarSign, Plus, Minus } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { FinancialGoal, GoalType } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: FinancialGoal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, goal }) => {
  const { addGoal, updateGoalProgress } = useTransactions();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState<GoalType>('one-time');
  const [installments, setInstallments] = useState('');
  const [progressAmount, setProgressAmount] = useState('');
  const [isAddingProgress, setIsAddingProgress] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDeadline(goal.deadline);
      setType(goal.type);
      setInstallments(goal.installments?.toString() || '');
      setIsAddingProgress(true);
    } else {
      resetForm();
      setIsAddingProgress(false);
    }
  }, [goal, isOpen]);

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setType('one-time');
    setInstallments('');
    setProgressAmount('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAddingProgress && goal) {
      // Update progress
      updateGoalProgress(goal.id, parseFloat(progressAmount));
    } else {
      // Add new goal
      const installmentAmount = type === 'installment' && parseInt(installments) > 0
        ? parseFloat(targetAmount) / parseInt(installments)
        : undefined;
        
      const newGoal = {
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline,
        type,
        installments: type === 'installment' ? parseInt(installments) : undefined,
        installmentAmount
      };
      
      addGoal(newGoal);
    }
    
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const calculateInstallmentAmount = () => {
    if (type === 'installment' && parseFloat(targetAmount) > 0 && parseInt(installments) > 0) {
      return (parseFloat(targetAmount) / parseInt(installments)).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6 border border-cardBorder relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-4 relative">
          <h2 className="text-xl font-semibold text-textPrimary flex items-center">
            <div className="absolute -inset-4 bg-gradient-radial from-primary/30 via-transparent to-transparent blur-xl -z-10"></div>
            <Target className="h-5 w-5 mr-2 text-primary" />
            {isAddingProgress && goal ? 'Atualizar Progresso' : 'Nova Meta Financeira'}
          </h2>
          <button 
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {isAddingProgress && goal ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-textPrimary relative">
                  {goal.title}
                  <div className="absolute -inset-2 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-xl -z-10"></div>
                </h3>
                <div className="mt-2 flex justify-between text-sm text-textSecondary">
                  <span>Progresso Atual:</span>
                  <span className="font-medium text-textPrimary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.currentAmount)} / 
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2.5 mt-2 relative overflow-hidden">
                  <div 
                    className="bg-primary h-2.5 rounded-full relative" 
                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-primary/30 to-transparent blur-md rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="progressAmount" className="block text-sm font-medium text-textPrimary mb-1">
                  Valor a Adicionar (R$)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-textSecondary" />
                  </div>
                  <input
                    type="number"
                    id="progressAmount"
                    value={progressAmount}
                    onChange={(e) => setProgressAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-textPrimary mb-1">
                  Título da Meta
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="targetAmount" className="block text-sm font-medium text-textPrimary mb-1">
                  Valor Total (R$)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-textSecondary" />
                  </div>
                  <input
                    type="number"
                    id="targetAmount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="currentAmount" className="block text-sm font-medium text-textPrimary mb-1">
                  Valor Inicial (R$)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-textSecondary" />
                  </div>
                  <input
                    type="number"
                    id="currentAmount"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="deadline" className="block text-sm font-medium text-textPrimary mb-1">
                  Prazo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-textSecondary" />
                  </div>
                  <input
                    type="date"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-textPrimary mb-1">
                  Tipo
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="one-time"
                      checked={type === 'one-time'}
                      onChange={() => setType('one-time')}
                      className="form-radio h-4 w-4 text-primary"
                    />
                    <span className="ml-2 text-textPrimary">À Vista</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="installment"
                      checked={type === 'installment'}
                      onChange={() => setType('installment')}
                      className="form-radio h-4 w-4 text-primary"
                    />
                    <span className="ml-2 text-textPrimary">Parcelado</span>
                  </label>
                </div>
              </div>
              
              {type === 'installment' && (
                <div className="mb-4">
                  <label htmlFor="installments" className="block text-sm font-medium text-textPrimary mb-1">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    min="1"
                    step="1"
                    className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required={type === 'installment'}
                  />
                  
                  {type === 'installment' && parseFloat(targetAmount) > 0 && parseInt(installments) > 0 && (
                    <div className="mt-2 text-sm text-textSecondary">
                      Valor da parcela: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(calculateInstallmentAmount()))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-textPrimary bg-background border border-cardBorder rounded-md hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white primary-button rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-transparent to-transparent blur-lg rounded-md -z-10"></div>
              {isAddingProgress && goal ? 'Atualizar Progresso' : 'Salvar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
