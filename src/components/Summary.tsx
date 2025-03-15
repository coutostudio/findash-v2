import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Filter } from 'lucide-react';

interface SummaryProps {
  income: number;
  expense: number;
  balance: number;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const Summary: React.FC<SummaryProps> = ({ income, expense, balance, onToggleFilters, showFilters }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="card rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className="glow-effect glow-primary-soft glow-summary"></div>
      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-xl font-semibold text-textPrimary relative">
          Resumo Financeiro
          <div className="absolute -inset-2 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-xl -z-10"></div>
        </h2>
        <button
          onClick={onToggleFilters}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md relative ${
            showFilters ? 'bg-primary text-white' : 'bg-card border border-cardBorder text-textPrimary'
          }`}
        >
          {showFilters && (
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent blur-lg rounded-md -z-10"></div>
          )}
          <Filter className="h-4 w-4" />
          <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border border-cardBorder rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textSecondary text-sm">Receitas</p>
              <p className="text-xl font-semibold text-green-400 mt-1">{formatCurrency(income)}</p>
            </div>
            <div className="bg-green-400/10 p-3 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-radial from-green-400/20 via-transparent to-transparent blur-lg rounded-full"></div>
              <ArrowUpCircle className="h-6 w-6 text-green-400 relative z-10" />
            </div>
          </div>
        </div>
        
        <div className="card border border-cardBorder rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textSecondary text-sm">Despesas</p>
              <p className="text-xl font-semibold text-red-400 mt-1">{formatCurrency(expense)}</p>
            </div>
            <div className="bg-red-400/10 p-3 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-radial from-red-400/20 via-transparent to-transparent blur-lg rounded-full"></div>
              <ArrowDownCircle className="h-6 w-6 text-red-400 relative z-10" />
            </div>
          </div>
        </div>
        
        <div className="card border border-cardBorder rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-textSecondary text-sm">Saldo</p>
              <p className={`text-xl font-semibold mt-1 ${
                balance >= 0 ? 'text-blue-400' : 'text-red-400'
              }`}>{formatCurrency(balance)}</p>
            </div>
            <div className={`${
              balance >= 0 ? 'bg-blue-400/10' : 'bg-red-400/10'
            } p-3 rounded-full relative`}>
              <div className={`absolute inset-0 bg-gradient-radial ${
                balance >= 0 ? 'from-blue-400/20' : 'from-red-400/20'
              } via-transparent to-transparent blur-lg rounded-full`}></div>
              <DollarSign className={`h-6 w-6 ${
                balance >= 0 ? 'text-blue-400' : 'text-red-400'
              } relative z-10`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
