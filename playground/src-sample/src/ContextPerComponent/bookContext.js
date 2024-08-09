import {
  useContext,
  createContext,
} from 'react';

export const BookContext = createContext(null);

export const useBookContext = () => {
  // The context object will contain anything returned by useProvideAuth
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};