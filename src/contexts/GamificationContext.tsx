import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getUserPoints,
  awardPoints as awardPointsService,
  getUserBadges,
  getLevelInfo,
  Badge,
  ActionType,
  UserPoints,
} from "@/services/gamificationService";
import { toast } from "@/hooks/use-toast";
import { getSessionStats } from "@/services/sessionPointsService";

interface GamificationContextType {
  points: number;
  level: number;
  levelName: string;
  pointsToNext: number;
  progressPercent: number;
  nextLevelName: string | undefined;
  earnedBadges: Badge[];
  lockedBadges: Badge[];
  isLoading: boolean;
  awardPoints: (actionType: ActionType) => Promise<void>;
  refreshBadges: () => Promise<void>;
  showBadgeModal: boolean;
  setShowBadgeModal: (show: boolean) => void;
  // Session points
  sessionPoints: number;
  sessionMilestone: string;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [lockedBadges, setLockedBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionMilestone, setSessionMilestone] = useState("");

  const levelInfo = getLevelInfo(points);

  useEffect(() => {
    loadUserData();
    
    // Update session points periodically
    const interval = setInterval(() => {
      const stats = getSessionStats();
      setSessionPoints(stats.points);
      setSessionMilestone(stats.milestone);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userPoints = await getUserPoints();
      setPoints(userPoints.total_points);
      setLevel(userPoints.current_level);

      const badges = await getUserBadges();
      setEarnedBadges(badges.earned);
      setLockedBadges(badges.locked);
    } catch (error) {
      console.error("Error loading gamification data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const awardPoints = async (actionType: ActionType) => {
    try {
      const result = await awardPointsService(actionType);

      if (result.points > 0) {
        setPoints((prev) => prev + result.points);
        
        // Show toast notification
        toast({
          title: `+${result.points} points earned!`,
          description: `Great job! Keep learning about your pension.`,
          duration: 3000,
        });

        // Check for level up
        const oldLevel = level;
        const newLevelInfo = getLevelInfo(points + result.points);
        if (newLevelInfo.level > oldLevel) {
          setLevel(newLevelInfo.level);
          toast({
            title: "🎉 Level Up!",
            description: `You've reached ${newLevelInfo.name}!`,
            duration: 5000,
          });
        }

        // Show new badges
        if (result.newBadges.length > 0) {
          await refreshBadges();
          result.newBadges.forEach((badge) => {
            toast({
              title: `${badge.icon} New Badge Unlocked!`,
              description: `${badge.name}: ${badge.description}`,
              duration: 5000,
            });
          });
        }
      }
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  const refreshBadges = async () => {
    const badges = await getUserBadges();
    setEarnedBadges(badges.earned);
    setLockedBadges(badges.locked);
  };

  return (
    <GamificationContext.Provider
      value={{
        points,
        level,
        levelName: levelInfo.name,
        pointsToNext: levelInfo.pointsToNext,
        progressPercent: levelInfo.progressPercent,
        nextLevelName: levelInfo.nextLevelName,
        earnedBadges,
        lockedBadges,
        isLoading,
        awardPoints,
        refreshBadges,
        showBadgeModal,
        setShowBadgeModal,
        sessionPoints,
        sessionMilestone,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
};
