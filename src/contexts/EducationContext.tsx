import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EDUCATION_TIPS } from '@/data/educationContent';

export interface EducationTip {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

interface EducationContextType {
  currentTip: EducationTip | null;
  isLoading: boolean;
  showTip: (tip: EducationTip) => void;
  showAITip: (fieldKey: string, userData?: any) => Promise<void>;
  hideTip: () => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

// Cache for AI-generated tips
const tipCache = new Map<string, EducationTip>();

export const EducationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTip, setCurrentTip] = useState<EducationTip | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showTip = (tip: EducationTip) => {
    setCurrentTip(tip);
  };

  const showAITip = async (fieldKey: string, userData?: any) => {
    // Check cache first
    const cacheKey = `${fieldKey}-${JSON.stringify(userData || {})}`;
    if (tipCache.has(cacheKey)) {
      setCurrentTip(tipCache.get(cacheKey)!);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-education-tip', {
        body: { fieldKey, userData }
      });

      if (error) {
        console.error('Error generating AI tip:', error);
        // Fallback to static tip
        const staticTip = EDUCATION_TIPS[fieldKey];
        if (staticTip) {
          setCurrentTip(staticTip);
        }
        return;
      }

      if (data) {
        tipCache.set(cacheKey, data);
        setCurrentTip(data);
      }
    } catch (err) {
      console.error('Failed to generate AI tip:', err);
      // Fallback to static tip
      const staticTip = EDUCATION_TIPS[fieldKey];
      if (staticTip) {
        setCurrentTip(staticTip);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hideTip = () => {
    setCurrentTip(null);
  };

  return (
    <EducationContext.Provider value={{ currentTip, isLoading, showTip, showAITip, hideTip }}>
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
