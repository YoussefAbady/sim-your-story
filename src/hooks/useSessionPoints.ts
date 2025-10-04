import { useState, useEffect, useCallback } from "react";
import {
  getSessionPoints,
  awardSessionPoints,
  getSessionStats,
  POINT_VALUES,
} from "@/services/sessionPointsService";
import { toast } from "sonner";

export function useSessionPoints() {
  const [stats, setStats] = useState(getSessionStats());

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
      toast.success(`+${earned} points earned!`, {
        description: milestone 
          ? `🎉 Milestone reached: ${milestone}` 
          : "Great job! Keep learning about your pension.",
        duration: 3000,
      });

      // Update stats
      setStats(getSessionStats());
    });

    return awarded;
  }, []);

  return {
    stats,
    awardPoints,
    POINT_VALUES,
  };
}
