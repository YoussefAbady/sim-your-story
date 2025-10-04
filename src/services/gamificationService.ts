import { supabase } from "@/integrations/supabase/client";
import { getUserIdentifier } from "./sessionTracker";

export interface Badge {
  id: string;
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
  category: string;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
}

export interface UserPoints {
  total_points: number;
  current_level: number;
}

export type ActionType =
  | "first_simulation"
  | "simulation_run"
  | "tip_read"
  | "detailed_tip_read"
  | "dashboard_visit"
  | "advanced_settings"
  | "scenario_comparison"
  | "view_report"
  | "share_results"
  | "expected_pension_set";

const ACTION_POINTS: Record<ActionType, number> = {
  first_simulation: 100,
  simulation_run: 20,
  tip_read: 10,
  detailed_tip_read: 25,
  dashboard_visit: 15,
  advanced_settings: 30,
  scenario_comparison: 40,
  view_report: 20,
  share_results: 50,
  expected_pension_set: 20,
};

const LEVEL_THRESHOLDS = [
  { level: 1, minPoints: 0, name: "Pension Newbie" },
  { level: 2, minPoints: 100, name: "Learning Explorer" },
  { level: 3, minPoints: 300, name: "Smart Planner" },
  { level: 4, minPoints: 600, name: "Future Builder" },
  { level: 5, minPoints: 1000, name: "Pension Master" },
];

export const getLevelInfo = (points: number) => {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].minPoints) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
      break;
    }
  }

  const pointsToNext = nextLevel ? nextLevel.minPoints - points : 0;
  const progressPercent = nextLevel
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    pointsToNext: Math.max(0, pointsToNext),
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    nextLevelName: nextLevel?.name,
  };
};

export const getUserPoints = async (): Promise<UserPoints> => {
  const userIdentifier = getUserIdentifier();

  const { data, error } = await supabase
    .from("user_points")
    .select("total_points, current_level")
    .eq("user_identifier", userIdentifier)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user points:", error);
    return { total_points: 0, current_level: 1 };
  }

  if (!data) {
    // Create new user points record
    const { data: newData, error: insertError } = await supabase
      .from("user_points")
      .insert({ user_identifier: userIdentifier, total_points: 0, current_level: 1 })
      .select("total_points, current_level")
      .single();

    if (insertError) {
      console.error("Error creating user points:", insertError);
      return { total_points: 0, current_level: 1 };
    }

    return newData;
  }

  return data;
};

export const awardPoints = async (actionType: ActionType): Promise<{ points: number; newBadges: Badge[] }> => {
  const userIdentifier = getUserIdentifier();
  const points = ACTION_POINTS[actionType] || 0;

  if (points === 0) {
    return { points: 0, newBadges: [] };
  }

  // Get current points
  const currentPoints = await getUserPoints();
  const newTotalPoints = currentPoints.total_points + points;
  const levelInfo = getLevelInfo(newTotalPoints);

  // Update points
  const { error: updateError } = await supabase
    .from("user_points")
    .update({
      total_points: newTotalPoints,
      current_level: levelInfo.level,
    })
    .eq("user_identifier", userIdentifier);

  if (updateError) {
    console.error("Error updating points:", updateError);
  }

  // Log points history
  await supabase.from("points_history").insert({
    user_identifier: userIdentifier,
    action_type: actionType,
    points_earned: points,
  });

  // Check for new badges
  const newBadges = await checkAndAwardBadges(newTotalPoints);

  return { points, newBadges };
};

export const checkAndAwardBadges = async (totalPoints: number): Promise<Badge[]> => {
  const userIdentifier = getUserIdentifier();

  // Get all badges
  const { data: allBadges, error: badgesError } = await supabase
    .from("badges")
    .select("*")
    .lte("points_required", totalPoints);

  if (badgesError || !allBadges) {
    console.error("Error fetching badges:", badgesError);
    return [];
  }

  // Get user's earned badges
  const { data: earnedBadges, error: earnedError } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_identifier", userIdentifier);

  if (earnedError) {
    console.error("Error fetching earned badges:", earnedError);
    return [];
  }

  const earnedBadgeIds = new Set(earnedBadges?.map((b) => b.badge_id) || []);
  const newBadges = allBadges.filter((badge) => !earnedBadgeIds.has(badge.badge_id));

  // Award new badges
  for (const badge of newBadges) {
    await supabase.from("user_badges").insert({
      user_identifier: userIdentifier,
      badge_id: badge.badge_id,
    });
  }

  return newBadges;
};

export const getUserBadges = async (): Promise<{ earned: Badge[]; locked: Badge[] }> => {
  const userIdentifier = getUserIdentifier();

  // Get all badges
  const { data: allBadges, error: badgesError } = await supabase.from("badges").select("*");

  if (badgesError || !allBadges) {
    console.error("Error fetching badges:", badgesError);
    return { earned: [], locked: [] };
  }

  // Get user's earned badges
  const { data: earnedBadges, error: earnedError } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_identifier", userIdentifier);

  if (earnedError) {
    console.error("Error fetching earned badges:", earnedError);
    return { earned: [], locked: allBadges };
  }

  const earnedBadgeIds = new Set(earnedBadges?.map((b) => b.badge_id) || []);
  const earned = allBadges.filter((badge) => earnedBadgeIds.has(badge.badge_id));
  const locked = allBadges.filter((badge) => !earnedBadgeIds.has(badge.badge_id));

  return { earned, locked };
};
