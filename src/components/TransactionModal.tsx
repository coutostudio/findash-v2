import React, { useState, useEffect } from 'react';
import { X, DollarSign, Trash2 } from 'lucide-react';
import { TransactionType, TransactionStatus, TransactionFormData } from '../types';
import { useTransactions } from '../context/TransactionContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
  editId?: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  embedded = false,
  editId 
}) => {
  const { addTransaction, updateTransaction, deleteTransaction, getTransactionById } = useTransactions();
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    dueDate: '',
    type: 'expense',
    status: 'pending',
    category: ''
  });

  useEffect(() => {
    if (editId) {
      const transaction = getTransactionById(editId);
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: transaction.amount.toString(),
          dueDate: transaction.dueDate,
          type: transaction.type,
          status: transaction.status,
          category: transaction.category || ''
        });
      }
    }
  }, [editId]);

  if (!isOpen && !embedded) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      type: formData.type,
      status: formData.status,
      category: formData.category || undefined
    };
    
    if (editId) {
      updateTransaction(editId, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      dueDate: '',
      type: 'expense',
      status: 'pending',
      category: ''
    });
    
    if (!embedded) onClose();
  };

  const handleDelete = () => {
    if (editId && confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(editId);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-textPrimary mb-1">
          Descrição
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-textPrimary mb-1">
          Valor (R$)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          min="0.01"
          step="0.01"
          className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-textPrimary mb-1">
          Data de Vencimento
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-textPrimary mb-1">
          Tipo
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleInputChange}
              className="form-radio h-4 w-4 text-primary"
            />
            <span className="ml-2 text-textPrimary">Despesa</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleInputChange}
              className="form-radio h-4 w-4 text-primary"
            />
            <span className="ml-2 text-textPrimary">Receita</span>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-textPrimary mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="overdue">Atrasado</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-textPrimary mb-1">
          Categoria
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-background border border-cardBorder text-textPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          {editId && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 rounded-md hover:bg-red-400/20 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </button>
          )}
        </div>
        <div className="flex">
          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-textPrimary bg-background border border-cardBorder rounded-md hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white primary-button rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative"
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-transparent to-transparent blur-lg rounded-md -z-10"></div>
            {editId ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6 border border-cardBorder relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-4 relative">
          <h2 className="text-xl font-semibold text-textPrimary flex items-center">
            <div className="absolute -inset-4 bg-gradient-radial from-primary/30 via-transparent to-transparent blur-xl -z-10"></div>
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            {editId ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button 
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {formContent}
      </div>
    </div>
  );
};

export default TransactionModal;
