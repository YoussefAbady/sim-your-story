import { useState, useEffect, useCallback } from "react";
import {
  getSessionPoints,
  awardSessionPoints,
  getSessionStats,
  POINT_VALUES,
} from "@/services/sessionPointsService";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";

export function useSessionPoints() {
  const [stats, setStats] = useState(getSessionStats());
  const { t } = useLocale();

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getSessionStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const awardPoints = useCallback((actionKey: string, pointValue: number) => {
    const awarded = awardSessionPoints(actionKey, pointValue, (newTotal, earned, milestone) => {
      // Show toast
      toast.success(t('gamification.pointsEarned').replace('{points}', earned.toString()), {
        description: milestone 
          ? t('gamification.milestoneReached').replace('{milestone}', milestone)
          : t('gamification.keepLearning'),
        duration: 3000,
      });

      // Update stats
      setStats(getSessionStats());
    });

    return awarded;
  }, [t]);

  return {
    stats,
    awardPoints,
    POINT_VALUES,
  };
}
