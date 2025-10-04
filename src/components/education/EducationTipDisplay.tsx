import { useEducation } from "@/contexts/EducationContext";
import { Card } from "@/components/ui/card";
import { Lightbulb, X, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export const EducationTipDisplay = () => {
  const { currentTip, isLoading, isLoadingDetailed, loadDetailedContent, hideTip } = useEducation();
  const { t } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expanded state when tip changes
  useEffect(() => {
    setIsExpanded(false);
  }, [currentTip?.id]);

  const handleLearnMore = () => {
    if (!currentTip?.detailedContent && currentTip) {
      loadDetailedContent(currentTip.id);
    }
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    hideTip();
  };

  return (
    <AnimatePresence>
      {(currentTip || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
            isExpanded ? 'max-w-2xl w-full' : 'max-w-md'
          }`}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-5 shadow-lg max-h-[80vh] overflow-y-auto">
            {isLoading ? (
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t('education.generating')}</h3>
                  <p className="text-sm text-muted-foreground">{t('education.generatingSubtitle')}</p>
                </div>
              </div>
            ) : currentTip ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      {currentTip.icon && <span className="text-xl">{currentTip.icon}</span>}
                      {t('education.didYouKnow')}
                    </h3>
                    <div className="flex gap-1">
                      {!isExpanded && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={handleLearnMore}
                          title={t('education.learnMore')}
                        >
                          <BookOpen className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleClose}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    {currentTip.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentTip.content}
                  </p>
                  
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-primary/20"
                    >
                      {isLoadingDetailed ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{t('education.loadingDetailed')}</span>
                        </div>
                      ) : currentTip.detailedContent ? (
                        <div 
                          className="detailed-content text-sm"
                          dangerouslySetInnerHTML={{ __html: currentTip.detailedContent }}
                        />
                      ) : null}
                    </motion.div>
                  )}
                </div>
              </div>
            ) : null}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
