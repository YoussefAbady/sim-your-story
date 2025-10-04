import { supabase } from "@/integrations/supabase/client";
import { getUserIdentifier } from "./sessionTracker";
import { triggerConfetti } from "@/lib/confetti";

export interface SessionPoints {
  total: number;
  milestone: string;
  interactions: Record<string, boolean>;
  startTime: number;
  actionCount: number;
}

// Point values for different actions
export const POINT_VALUES = {
  // Form interactions
  FIELD_FOCUS: 5,
  SECTION_COMPLETE_REQUIRED: 15,
  SECTION_COMPLETE_OPTIONAL: 10,
  TOGGLE_SWITCH: 5,
  CARD_CLICK: 5,
  
  // Dashboard interactions
  TAB_SWITCH: 5,
  ADD_HISTORICAL_SALARY: 8,
  ADD_FUTURE_SALARY: 8,
  ADD_ILLNESS_PERIOD: 8,
  SET_CUSTOM_RATE: 10,
  SAVE_SETTINGS: 20,
  
  // Results interactions
  VIEW_REPORT: 15,
  EXPAND_SECTION: 10,
  DOWNLOAD_REPORT: 25,
  SHARE_RESULTS: 30,
  
  // Education content
  READ_TIP: 10,
  READ_DETAILED: 25,
  LEARN_MORE: 15,
  
  // Landing page
  SET_PENSION: 10,
  FEATURE_CLICK: 5,
  HOW_IT_WORKS: 5,
  SCROLL_CTA: 5,
  
  // Existing actions
  SIMULATION_COMPLETE: 100,
  ADDITIONAL_SIMULATION: 20,
} as const;

// Milestones
export const MILESTONES = [
  { threshold: 0, name: "🌱 Getting Started", icon: "🌱" },
  { threshold: 50, name: "🌟 Knowledge Explorer", icon: "🌟" },
  { threshold: 100, name: "🎓 Learning Champion", icon: "🎓" },
  { threshold: 150, name: "💡 Pension Expert", icon: "💡" },
  { threshold: 200, name: "🏆 Master Learner", icon: "🏆" },
];

const SESSION_STORAGE_KEY = "session_points";
const SESSION_ID_KEY = "session_id";

// Generate session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Get current session points
export function getSessionPoints(): SessionPoints {
  const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize new session
  const newSession: SessionPoints = {
    total: 0,
    milestone: MILESTONES[0].name,
    interactions: {},
    startTime: Date.now(),
    actionCount: 0,
  };
  
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
  return newSession;
}

// Get current milestone
function getMilestone(points: number): { threshold: number; name: string; icon: string } {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (points >= MILESTONES[i].threshold) {
      return MILESTONES[i];
    }
  }
  return MILESTONES[0];
}

// Get next milestone
export function getNextMilestone(points: number): { threshold: number; name: string; icon: string } | null {
  for (const milestone of MILESTONES) {
    if (points < milestone.threshold) {
      return milestone;
    }
  }
  return null;
}

// Award points for an action
export function awardSessionPoints(
  actionKey: string,
  pointValue: number,
  onPointsAwarded?: (newTotal: number, pointsEarned: number, milestone?: string) => void
): boolean {
  const session = getSessionPoints();
  
  // Check if action already performed
  if (session.interactions[actionKey]) {
    return false;
  }
  
  // Award points
  const oldMilestone = getMilestone(session.total);
  session.total += pointValue;
  session.actionCount += 1;
  session.interactions[actionKey] = true;
  const newMilestone = getMilestone(session.total);
  
  // Update session storage
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  
  // Check for milestone achievement
  let milestoneReached: string | undefined;
  if (oldMilestone.threshold !== newMilestone.threshold) {
    session.milestone = newMilestone.name;
    milestoneReached = newMilestone.name;
    
    // Trigger confetti on milestone
    triggerConfetti();
  }
  
  // Callback with results
  if (onPointsAwarded) {
    onPointsAwarded(session.total, pointValue, milestoneReached);
  }
  
  return true;
}

// Save session summary to database
export async function saveSessionSummary() {
  const session = getSessionPoints();
  const sessionId = getSessionId();
  const userIdentifier = getUserIdentifier();
  
  const duration = Math.floor((Date.now() - session.startTime) / 1000);
  
  try {
    await supabase.from("session_points_summary").insert({
      session_id: sessionId,
      user_identifier: userIdentifier,
      total_points: session.total,
      actions_performed: session.actionCount,
      duration_seconds: duration,
      milestone_reached: session.milestone,
      unique_interactions: session.interactions,
    });
  } catch (error) {
    console.error("Error saving session summary:", error);
  }
}

// Clear session points (for new session)
export function clearSessionPoints() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_ID_KEY);
}

// Get session stats
export function getSessionStats() {
  const session = getSessionPoints();
  const duration = Math.floor((Date.now() - session.startTime) / 1000);
  const nextMilestone = getNextMilestone(session.total);
  
  return {
    points: session.total,
    milestone: session.milestone,
    actions: session.actionCount,
    duration,
    nextMilestone: nextMilestone ? {
      name: nextMilestone.name,
      icon: nextMilestone.icon,
      pointsNeeded: nextMilestone.threshold - session.total,
      progress: (session.total / nextMilestone.threshold) * 100,
    } : null,
  };
}
