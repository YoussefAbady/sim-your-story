import { useEducation } from "@/contexts/EducationContext";
import { Card } from "@/components/ui/card";
import { Lightbulb, X, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import DOMPurify from "dompurify";
import { useLocation } from "react-router-dom";

export const EducationTipDisplay = ({ sidebarOpen }: { sidebarOpen?: boolean } = {}) => {
  const { currentTip, isLoading, isLoadingDetailed, loadDetailedContent, hideTip } = useEducation();
  const { t } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const isResultsPage = location.pathname === '/results';

  // Reset expanded state when tip changes
  useEffect(() => {
    setIsExpanded(false);
  }, [currentTip?.id]);

  const handleLearnMore = async () => {
    if (!currentTip?.detailedContent && currentTip) {
      loadDetailedContent(currentTip.id);
    }
    setIsExpanded(true);
    
    // Award points for reading detailed content
    if (currentTip) {
      const { awardSessionPoints, POINT_VALUES } = await import("@/services/sessionPointsService");
      awardSessionPoints(
        `read-detailed-${currentTip.id}`,
        POINT_VALUES.READ_DETAILED
      );
    }
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
          className={`fixed bottom-6 ${sidebarOpen ? 'right-[calc(30vw+1.5rem)]' : 'right-6'} transition-all duration-300 ${
            isExpanded ? 'max-w-2xl w-full' : 'max-w-md'
          }`}
          style={{ zIndex: 9999 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-lg max-h-[80vh] overflow-hidden flex flex-col relative">
            {isLoading ? (
              <div className="sticky top-0 z-20 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur p-5 border-b border-primary/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{t('education.generating')}</h3>
                      <p className="text-sm text-muted-foreground">{t('education.generatingSubtitle')}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={handleClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : currentTip ? (
              <>
                <div className="sticky top-0 z-20 p-5 border-b border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {currentTip.icon && <span className="text-xl">{currentTip.icon}</span>}
                          {t('education.didYouKnow')}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
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
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 pt-0">
                  <div className="flex items-start gap-3 mt-5">
                    <div className="w-10 h-10 shrink-0"></div>
                    <div className="flex-1">
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
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(currentTip.detailedContent, {
                                  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'div', 'span'],
                                  ALLOWED_ATTR: ['style', 'class']
                                })
                              }}
                            />
                          ) : null}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
