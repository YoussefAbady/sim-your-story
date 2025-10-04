import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EDUCATION_TIPS } from '@/data/educationContent';
import { useLocale } from '@/contexts/LocaleContext';
import { awardPoints } from '@/services/gamificationService';

export interface EducationTip {
  id: string;
  title: string;
  content: string;
  icon?: string;
  detailedContent?: string;
  timestamp?: number;
  category?: string;
}

interface EducationContextType {
  currentTip: EducationTip | null;
  isLoading: boolean;
  isLoadingDetailed: boolean;
  tipHistory: EducationTip[];
  lastFieldKey: string | null;
  lastUserData: any | null;
  showTip: (tip: EducationTip) => void;
  showAITip: (fieldKey: string, userData?: any) => Promise<void>;
  loadDetailedContent: (fieldKey: string, userData?: any) => Promise<void>;
  hideTip: () => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

// Cache for AI-generated tips
const tipCache = new Map<string, EducationTip>();

export const EducationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { locale } = useLocale();
  const [currentTip, setCurrentTip] = useState<EducationTip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);
  const [tipHistory, setTipHistory] = useState<EducationTip[]>([]);
  const [lastFieldKey, setLastFieldKey] = useState<string | null>(null);
  const [lastUserData, setLastUserData] = useState<any | null>(null);

  const showTip = (tip: EducationTip) => {
    setCurrentTip(tip);
  };

  const addTipToHistory = (tip: EducationTip) => {
    const tipWithTimestamp = { ...tip, timestamp: Date.now() };
    setTipHistory(prev => [tipWithTimestamp, ...prev]);
  };

  const showAITip = async (fieldKey: string, userData?: any) => {
    // Persist last context for chat reuse
    setLastFieldKey(fieldKey);
    setLastUserData(userData || null);
    // Check cache first with language
    const cacheKey = `${fieldKey}-${locale}-${JSON.stringify(userData || {})}`;
    if (tipCache.has(cacheKey)) {
      const cachedTip = tipCache.get(cacheKey)!;
      addTipToHistory(cachedTip);
      setCurrentTip(cachedTip);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-education-tip', {
        body: { fieldKey, userData, language: locale }
      });

      if (error) {
        console.error('Error generating AI tip:', error);
        // Fallback to static tip
        const staticTip = EDUCATION_TIPS[fieldKey];
        if (staticTip) {
          addTipToHistory(staticTip);
          setCurrentTip(staticTip);
        }
        return;
      }

      if (data) {
        tipCache.set(cacheKey, data);
        addTipToHistory(data);
        setCurrentTip(data);
        awardPoints('tip_read');
      }
    } catch (err) {
      console.error('Failed to generate AI tip:', err);
      // Fallback to static tip
      const staticTip = EDUCATION_TIPS[fieldKey];
      if (staticTip) {
        addTipToHistory(staticTip);
        setCurrentTip(staticTip);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadDetailedContent = async (fieldKey: string, userData?: any) => {
    if (!currentTip) return;
    
    setIsLoadingDetailed(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-education-tip', {
        body: { fieldKey, userData, detailed: true, language: locale }
      });

      if (error) {
        console.error('Error loading detailed content:', error);
        return;
      }

      if (data?.detailedContent) {
        setCurrentTip(prev => prev ? { ...prev, detailedContent: data.detailedContent } : null);
        awardPoints('detailed_tip_read');
      }
    } catch (err) {
      console.error('Failed to load detailed content:', err);
    } finally {
      setIsLoadingDetailed(false);
    }
  };

  const hideTip = () => {
    setCurrentTip(null);
  };

  return (
    <EducationContext.Provider value={{ 
      currentTip, 
      isLoading, 
      isLoadingDetailed, 
      tipHistory, 
      lastFieldKey,
      lastUserData,
      showTip, 
      showAITip, 
      loadDetailedContent,
      hideTip
    }}>
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
