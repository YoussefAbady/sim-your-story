import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSessionStats, saveSessionSummary, clearSessionPoints } from "@/services/sessionPointsService";
import { Trophy, Clock, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function SessionSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(getSessionStats());

  useEffect(() => {
    // Show summary before page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stats.points > 0) {
        saveSessionSummary();
      }
    };

    // Show summary modal on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden && stats.points > 20) {
        setStats(getSessionStats());
        setIsOpen(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stats.points]);

  const handleContinue = () => {
    setIsOpen(false);
  };

  const handleNewSession = async () => {
    await saveSessionSummary();
    clearSessionPoints();
    setIsOpen(false);
    window.location.reload();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">🎉 Great Session!</DialogTitle>
          <DialogDescription className="text-center">
            Here's what you accomplished
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center"
          >
            <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
            <div className="text-4xl font-bold text-foreground mb-1">{stats.points}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
            <div className="text-xs text-primary font-semibold mt-2">{stats.milestone}</div>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <BookOpen className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-lg font-bold">{stats.actions}</div>
              <div className="text-xs text-muted-foreground">Actions</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-lg font-bold">{formatDuration(stats.duration)}</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>

            {stats.nextMilestone && (
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <Target className="w-5 h-5 text-accent mx-auto mb-1" />
                <div className="text-lg font-bold">{stats.nextMilestone.pointsNeeded}</div>
                <div className="text-xs text-muted-foreground">To Next</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleContinue} className="flex-1">
            Continue Learning
          </Button>
          <Button onClick={handleNewSession} variant="outline" className="flex-1">
            New Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
