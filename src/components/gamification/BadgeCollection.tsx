import { useGamification } from "@/contexts/GamificationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export const BadgeCollection = () => {
  const { earnedBadges, lockedBadges, showBadgeModal, setShowBadgeModal, sessionPoints } = useGamification();

  const allBadges = [...earnedBadges, ...lockedBadges].sort((a, b) => a.points_required - b.points_required);
  const earnedCount = allBadges.filter((b) => sessionPoints >= b.points_required).length;

  return (
    <Dialog open={showBadgeModal} onOpenChange={setShowBadgeModal}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle className="text-2xl font-bold">Badge Collection</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {earnedCount} of {allBadges.length} badges earned
            </span>
            <Progress value={(earnedCount / allBadges.length) * 100} className="h-2 flex-1" />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {allBadges.map((badge, index) => {
            const earned = sessionPoints >= badge.points_required;
            const progress = earned ? 100 : Math.min(100, (sessionPoints / badge.points_required) * 100);

            return (
              <motion.div
                key={badge.badge_id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  earned
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                    : "border-muted bg-muted/20"
                }`}
              >
                {!earned && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}

                <div className="text-center">
                  <div className={`text-4xl mb-2 ${!earned && "grayscale opacity-40"}`}>{badge.icon}</div>
                  <h3 className={`font-semibold text-sm mb-1 ${!earned && "text-muted-foreground"}`}>
                    {badge.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{badge.description}</p>

                  <Badge variant={earned ? "default" : "secondary"} className="text-xs">
                    {badge.category}
                  </Badge>

                  {!earned && (
                    <div className="mt-2">
                      <Progress value={progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {badge.points_required} points needed
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
