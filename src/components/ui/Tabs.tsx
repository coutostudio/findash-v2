import React, { createContext, useContext, useState } from 'react';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`inline-flex p-1 bg-card rounded-md ${className || ''}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isActive = selectedValue === value;

  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        isActive ? 'tab-active' : 'text-textPrimary hover:bg-card/80'
      }`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const { value: selectedValue } = useTabs();

  if (selectedValue !== value) {
    return null;
  }

  return <div className="mt-2">{children}</div>;
};
