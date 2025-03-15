import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionModal from './TransactionModal';

const ActionButtons: React.FC = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background relative"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-primary/20 to-transparent blur-xl rounded-full"></div>
          <Plus className="h-6 w-6 relative z-10" />
        </button>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </>
  );
};

export default ActionButtons;
