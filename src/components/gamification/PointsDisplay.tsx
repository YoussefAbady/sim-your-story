import { useGamification } from "@/contexts/GamificationContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";

export const PointsDisplay = () => {
  const {
    points,
    levelName,
    pointsToNext,
    progressPercent,
    nextLevelName,
    earnedBadges,
    setShowBadgeModal,
    isLoading,
  } = useGamification();

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
          <div className="bg-primary/20 p-2 rounded-full">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                key={points}
                initial={{ scale: 1.5, color: "hsl(var(--primary))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                className="text-lg font-bold"
              >
                {points}
              </motion.span>
              <span className="text-sm text-muted-foreground">points</span>
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              {levelName}
            </Badge>
          </div>
        </div>

        <button
          onClick={() => setShowBadgeModal(true)}
          className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 transition-colors px-3 py-2 rounded-lg"
        >
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">{earnedBadges.length}</span>
        </button>
      </div>

      {nextLevelName && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress to {nextLevelName}</span>
            <span>{pointsToNext} points to go</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}
    </motion.div>
  );
};
