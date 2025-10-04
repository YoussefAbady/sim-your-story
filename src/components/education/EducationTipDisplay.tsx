import { useEducation } from "@/contexts/EducationContext";
import { Card } from "@/components/ui/card";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const EducationTipDisplay = () => {
  const { currentTip, hideTip } = useEducation();

  return (
    <AnimatePresence>
      {currentTip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {currentTip.icon && <span className="text-xl">{currentTip.icon}</span>}
                    Did You Know?
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1"
                    onClick={hideTip}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <h4 className="font-medium text-sm text-foreground mb-1">
                  {currentTip.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentTip.content}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
