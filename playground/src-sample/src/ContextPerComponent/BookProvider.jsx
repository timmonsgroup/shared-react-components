import { useState, useMemo } from 'react';
import { BookContext } from './bookContext';

export const BookProvider = ({ children }) => {
  const [book, setBook] = useState({ name: '' });

  const value = useMemo(() => {
    const changeName = (name) => {
      setBook((book) => ({ ...book, name }));
    };

    return { book, changeName };
  }, [book, setBook]);


  // We are providing the object returned by a useMemo as the value of the BookContext
  // failing to memoize the value varible would mean we are re-creating the object every time the component re-renders
  // this would cause the context to be re-created and all children re-rendered
  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};