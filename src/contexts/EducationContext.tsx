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
}

interface EducationContextType {
  currentTip: EducationTip | null;
  isLoading: boolean;
  isLoadingDetailed: boolean;
  isPanelOpen: boolean;
  tipHistory: EducationTip[];
  showTip: (tip: EducationTip) => void;
  showAITip: (fieldKey: string, userData?: any) => Promise<void>;
  loadDetailedContent: (fieldKey: string, userData?: any) => Promise<void>;
  loadDetailedContentForHistoryTip: (tip: EducationTip) => Promise<void>;
  hideTip: () => void;
  togglePanel: () => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

// Cache for AI-generated tips
const tipCache = new Map<string, EducationTip>();

export const EducationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { locale } = useLocale();
  const [currentTip, setCurrentTip] = useState<EducationTip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [tipHistory, setTipHistory] = useState<EducationTip[]>([]);

  const showTip = (tip: EducationTip) => {
    setCurrentTip(tip);
  };

  const addTipToHistory = (tip: EducationTip) => {
    const tipWithTimestamp = { ...tip, timestamp: Date.now() };
    setTipHistory(prev => [tipWithTimestamp, ...prev]);
  };

  const showAITip = async (fieldKey: string, userData?: any) => {
    // Check cache first with language
    const cacheKey = `${fieldKey}-${locale}-${JSON.stringify(userData || {})}`;
    if (tipCache.has(cacheKey)) {
      const cachedTip = tipCache.get(cacheKey)!;
      addTipToHistory(cachedTip);
      if (!isPanelOpen) {
        setCurrentTip(cachedTip);
      }
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
          if (!isPanelOpen) {
            setCurrentTip(staticTip);
          }
        }
        return;
      }

      if (data) {
        tipCache.set(cacheKey, data);
        addTipToHistory(data);
        if (!isPanelOpen) {
          setCurrentTip(data);
        }
        awardPoints('tip_read');
      }
    } catch (err) {
      console.error('Failed to generate AI tip:', err);
      // Fallback to static tip
      const staticTip = EDUCATION_TIPS[fieldKey];
      if (staticTip) {
        addTipToHistory(staticTip);
        if (!isPanelOpen) {
          setCurrentTip(staticTip);
        }
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

  const loadDetailedContentForHistoryTip = async (tip: EducationTip) => {
    setIsLoadingDetailed(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-education-tip', {
        body: { fieldKey: tip.id, detailed: true, language: locale }
      });

      if (error) {
        console.error('Error loading detailed content:', error);
        return;
      }

      if (data?.detailedContent) {
        // Update the tip in history
        setTipHistory(prev => prev.map(t => 
          t.timestamp === tip.timestamp && t.id === tip.id
            ? { ...t, detailedContent: data.detailedContent }
            : t
        ));
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

  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
    if (!isPanelOpen) {
      setCurrentTip(null); // Hide popup when opening panel
    }
  };

  return (
    <EducationContext.Provider value={{ 
      currentTip, 
      isLoading, 
      isLoadingDetailed, 
      isPanelOpen, 
      tipHistory, 
      showTip, 
      showAITip, 
      loadDetailedContent,
      loadDetailedContentForHistoryTip,
      hideTip, 
      togglePanel 
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
