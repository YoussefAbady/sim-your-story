import { useGamification } from "@/contexts/GamificationContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getNextMilestone } from "@/services/sessionPointsService";

export const PointsDisplay = () => {
  const {
    sessionPoints,
    sessionMilestone,
    earnedBadges,
    setShowBadgeModal,
    isLoading,
    lockedBadges,
  } = useGamification();
  
  const nextMilestone = getNextMilestone(sessionPoints);
  const allBadges = [...earnedBadges, ...(lockedBadges || [])];
  const earnedCount = allBadges.filter((b) => sessionPoints >= b.points_required).length;

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border border-primary/20 shadow-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="bg-primary/20 p-2 rounded-full"
          >
            <Zap className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Session:</span>
              <motion.span
                key={sessionPoints}
                initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                className="text-lg font-bold"
              >
                {sessionPoints}
              </motion.span>
              <span className="text-sm text-muted-foreground">pts</span>
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              {sessionMilestone}
            </Badge>
          </div>
        </div>

        <button
          onClick={() => setShowBadgeModal(true)}
          className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 transition-colors px-3 py-2 rounded-lg"
        >
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">{earnedCount}</span>
        </button>
      </div>

      {nextMilestone && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Next: {nextMilestone.icon} {nextMilestone.name}</span>
            <span>{nextMilestone.threshold - sessionPoints} pts to go</span>
          </div>
          <Progress 
            value={(sessionPoints / nextMilestone.threshold) * 100} 
            className="h-2" 
          />
        </div>
      )}
    </motion.div>
  );
};
