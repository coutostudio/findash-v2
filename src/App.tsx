import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ActionButtons from './components/ActionButtons';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-background text-textPrimary flex flex-col font-sora relative overflow-hidden">
        <div className="light-point light-point-top"></div>
        <div className="light-point light-point-bottom"></div>
        <Header />
        <main className="flex-grow py-6 relative z-10">
          <Dashboard />
        </main>
        <ActionButtons />
      </div>
    </TransactionProvider>
  );
}

export default App;
