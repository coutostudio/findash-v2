import React, { useState } from 'react';
import { Transaction } from '../types';
import { Check, Clock, AlertTriangle, ChevronDown, Pencil } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import TransactionModal from './TransactionModal';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const { updateTransactionStatus } = useTransactions();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);

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

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      default:
        return '';
    }
  };

  const getStatusClass = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-400/10 text-green-400';
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-400';
      case 'overdue':
        return 'bg-red-400/10 text-red-400';
      default:
        return '';
    }
  };

  const handleStatusChange = (id: string, status: Transaction['status']) => {
    updateTransactionStatus(id, status);
    setOpenDropdown(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-textSecondary">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cardBorder">
              <th className="px-4 py-2 text-left text-sm font-medium text-textSecondary">Descrição</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-textSecondary">Valor</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-textSecondary">Vencimento</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-textSecondary">Status</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-textSecondary">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-cardBorder hover:bg-card/80">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-textPrimary">{transaction.description}</p>
                    {transaction.category && (
                      <p className="text-xs text-textSecondary mt-1">{transaction.category}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-textSecondary">
                  {formatDate(transaction.dueDate)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === transaction.id ? null : transaction.id)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusClass(transaction.status)}`}
                    >
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{getStatusText(transaction.status)}</span>
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </button>
                    {openDropdown === transaction.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-cardBorder rounded-md shadow-lg z-20">
                        <div className="py-1">
                          <button
                            onClick={() => handleStatusChange(transaction.id, 'paid')}
                            className="block w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-primary hover:text-white"
                          >
                            Marcar como Pago
                          </button>
                          <button
                            onClick={() => handleStatusChange(transaction.id, 'pending')}
                            className="block w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-primary hover:text-white"
                          >
                            Marcar como Pendente
                          </button>
                          <button
                            onClick={() => handleStatusChange(transaction.id, 'overdue')}
                            className="block w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-primary hover:text-white"
                          >
                            Marcar como Atrasado
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setEditingTransaction(transaction.id)}
                    className="text-textSecondary hover:text-primary"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        editId={editingTransaction || undefined}
      />
    </>
  );
};

export default TransactionList;
