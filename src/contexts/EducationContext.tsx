import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EducationTip {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

interface EducationContextType {
  currentTip: EducationTip | null;
  showTip: (tip: EducationTip) => void;
  hideTip: () => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export const EducationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTip, setCurrentTip] = useState<EducationTip | null>(null);

  const showTip = (tip: EducationTip) => {
    setCurrentTip(tip);
  };

  const hideTip = () => {
    setCurrentTip(null);
  };

  return (
    <EducationContext.Provider value={{ currentTip, showTip, hideTip }}>
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (!context) {
    throw new Error('useEducation must be used within EducationProvider');
  }
  return context;
};
