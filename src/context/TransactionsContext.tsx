import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TransactionsContextType {
  version: number;
  refresh: () => void;
}

const TransactionsContext = createContext<TransactionsContextType>({
  version: 0,
  refresh: () => {},
});

export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  return (
    <TransactionsContext.Provider value={{ version, refresh }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => useContext(TransactionsContext);