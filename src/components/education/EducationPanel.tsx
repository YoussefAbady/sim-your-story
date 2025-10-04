import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";
import { useEducation } from "@/contexts/EducationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function EducationPanel() {
  const { isPanelOpen, tipHistory, togglePanel, isLoading, loadDetailedContent, isLoadingDetailed } = useEducation();
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());
  const [loadingDetailedTips, setLoadingDetailedTips] = useState<Set<string>>(new Set());

  const toggleExpanded = async (tip: any) => {
    const tipKey = `${tip.id}-${tip.timestamp}`;
    
    if (expandedTips.has(tipKey)) {
      // Collapse
      setExpandedTips((prev) => {
        const next = new Set(prev);
        next.delete(tipKey);
        return next;
      });
    } else {
      // Expand and load detailed content if needed
      if (!tip.detailedContent) {
        setLoadingDetailedTips((prev) => new Set(prev).add(tipKey));
        await loadDetailedContent(tip.id);
        setLoadingDetailedTips((prev) => {
          const next = new Set(prev);
          next.delete(tipKey);
          return next;
        });
      }
      setExpandedTips((prev) => new Set(prev).add(tipKey));
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-96 bg-background border-r shadow-xl z-30 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Learning Center</h2>
              {tipHistory.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {tipHistory.length}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePanel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {isLoading && tipHistory.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-muted-foreground">Loading tips...</p>
                </div>
              </div>
            )}

            {tipHistory.length === 0 && !isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Start exploring to collect educational tips!
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {tipHistory.map((tip, index) => {
                const tipKey = `${tip.id}-${tip.timestamp}`;
                const isExpanded = expandedTips.has(tipKey);
                const isLoadingDetails = loadingDetailedTips.has(tipKey);
                
                return (
                  <Card key={tipKey} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {tip.icon && <span className="text-lg">{tip.icon}</span>}
                          <span className="flex-1">{tip.title}</span>
                        </CardTitle>
                        {tip.timestamp && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(tip.timestamp)}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{tip.content}</p>
                      
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(tip)}
                          className="w-full justify-between h-8 px-2"
                        >
                          <span className="text-xs flex items-center gap-2">
                            <BookOpen className="h-3 w-3" />
                            {isExpanded ? "Show less" : "Learn more"}
                          </span>
                          {isLoadingDetails && <Loader2 className="h-3 w-3 animate-spin" />}
                        </Button>
                        
                        <AnimatePresence>
                          {isExpanded && (tip.detailedContent || isLoadingDetails) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {isLoadingDetails ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                              ) : (
                                <div
                                  className="text-xs text-muted-foreground prose prose-sm max-w-none dark:prose-invert pt-2 border-t"
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(tip.detailedContent),
                                  }}
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

