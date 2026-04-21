import React, { createContext, useContext, useState, useEffect } from 'react';

const DivisionContext = createContext(undefined);

export const DivisionProvider = ({ children }) => {
  const [activeDivision, setActiveDivision] = useState(() => {
    const saved = localStorage.getItem('active_division');
    return saved && saved !== 'CP' ? saved : 'Development';
  });

  const switchDivision = (divisionName) => {
    setActiveDivision(divisionName);
    localStorage.setItem('active_division', divisionName);
  };

  return (
    <DivisionContext.Provider value={{ activeDivision, switchDivision }}>
      {children}
    </DivisionContext.Provider>
  );
};

export const useDivision = () => {
  const context = useContext(DivisionContext);
  if (context === undefined) {
    throw new Error('useDivision must be used within a DivisionProvider');
  }
  return context;
};
