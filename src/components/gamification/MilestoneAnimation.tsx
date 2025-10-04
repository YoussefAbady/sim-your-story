import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

interface MilestoneAnimationProps {
  milestone: string;
  onComplete?: () => void;
}

export function MilestoneAnimation({ milestone, onComplete }: MilestoneAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg shadow-2xl p-6 max-w-sm"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <Trophy className="w-10 h-10" />
            </motion.div>
            <div>
              <div className="text-lg font-bold">🎉 Milestone Reached!</div>
              <div className="text-sm opacity-90">{milestone}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
