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
          initial={{ opacity: 0, scale: 0.3, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.3, y: -100 }}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[hsl(270_75%_60%)] via-[hsl(330_80%_65%)] to-[hsl(25_95%_60%)] text-white rounded-xl shadow-2xl p-8 max-w-sm border-2 border-white/20"
          style={{
            boxShadow: '0 0 40px rgba(255, 105, 180, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-xl"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="flex items-center gap-4 relative">
            <motion.div
              animate={{
                rotate: [0, -15, 15, -15, 15, 0],
                scale: [1, 1.3, 1.3, 1.3, 1.3, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="flex-shrink-0"
            >
              <Trophy className="w-14 h-14 drop-shadow-lg" />
            </motion.div>
            <div className="flex-1">
              <motion.div 
                className="text-2xl font-bold mb-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                🎉 Milestone!
              </motion.div>
              <motion.div 
                className="text-base opacity-95"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {milestone}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
