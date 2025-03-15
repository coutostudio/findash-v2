import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Filter, TransactionType, TransactionStatus } from '../types';
import { Filter as FilterIcon, X, Calendar } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const { filter, setFilter, transactions } = useTransactions();
  const [localFilter, setLocalFilter] = useState<Filter>(filter);

  // Get unique categories from transactions
  const categories = Array.from(
    new Set(transactions.filter(t => t.category).map(t => t.category))
  ) as string[];

  const handleFilterChange = (key: keyof Filter, value: any) => {
    setLocalFilter(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilter(localFilter);
  };

  const resetFilters = () => {
    const resetFilter: Filter = {
      type: 'all',
      status: 'all',
      category: 'all',
      dateFrom: null,
      dateTo: null,
      period: 'all'
    };
    setLocalFilter(resetFilter);
    setFilter(resetFilter);
  };

  const applyPeriodFilter = (period: string) => {
    const today = new Date();
    let dateFrom: string | null = null;
    let dateTo: string | null = today.toISOString().split('T')[0];
    
    if (period === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      dateFrom = sevenDaysAgo.toISOString().split('T')[0];
    } else if (period === '28days') {
      const twentyEightDaysAgo = new Date();
      twentyEightDaysAgo.setDate(today.getDate() - 28);
      dateFrom = twentyEightDaysAgo.toISOString().split('T')[0];
    } else if (period === 'lastMonth') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      dateFrom = firstDayLastMonth.toISOString().split('T')[0];
      dateTo = lastDayLastMonth.toISOString().split('T')[0];
    }
    
    const newFilter = {
      ...localFilter,
      dateFrom,
      dateTo,
      period
    };
    
    setLocalFilter(newFilter);
    setFilter(newFilter);
  };

  useEffect(() => {
    // Apply filters when component mounts
    applyFilters();
  }, []);

  return (
    <div className="card rounded-lg shadow-md p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-textPrimary flex items-center">
          <FilterIcon className="h-5 w-5 mr-2" />
          Filtros
        </h3>
        <button 
          onClick={resetFilters}
          className="text-sm text-textSecondary hover:text-textPrimary flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Limpar Filtros
        </button>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-textPrimary mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Período Rápido
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPeriodFilter('7days')}
            className={`px-3 py-1 text-sm rounded-md ${
              localFilter.period === '7days' 
                ? 'bg-primary text-white' 
                : 'bg-card border border-cardBorder text-textPrimary hover:bg-card/80'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => applyPeriodFilter('28days')}
            className={`px-3 py-1 text-sm rounded-md ${
              localFilter.period === '28days' 
                ? 'bg-primary text-white' 
                : 'bg-card border border-cardBorder text-textPrimary hover:bg-card/80'
            }`}
          >
            Últimos 28 dias
          </button>
          <button
            onClick={() => applyPeriodFilter('lastMonth')}
            className={`px-3 py-1 text-sm rounded-md ${
              localFilter.period === 'lastMonth' 
                ? 'bg-primary text-white' 
                : 'bg-card border border-cardBorder text-textPrimary hover:bg-card/80'
            }`}
          >
            Mês anterior
          </button>
          <button
            onClick={() => applyPeriodFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              localFilter.period === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-card border border-cardBorder text-textPrimary hover:bg-card/80'
            }`}
          >
            Todos
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Tipo
          </label>
          <select
            value={localFilter.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-card border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Status
          </label>
          <select
            value={localFilter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-card border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="overdue">Atrasado</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Categoria
          </label>
          <select
            value={localFilter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-card border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todas</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Data Inicial
          </label>
          <input
            type="date"
            value={localFilter.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value || null)}
            className="w-full px-3 py-2 bg-card border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Data Final
          </label>
          <input
            type="date"
            value={localFilter.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value || null)}
            className="w-full px-3 py-2 bg-card border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={applyFilters}
          className="px-4 py-2 primary-button rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
