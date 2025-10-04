import { supabase } from "@/integrations/supabase/client";

class SessionTracker {
  private sessionId: string;
  private startTime: Date;
  private lastActivityTime: Date;
  private pagePath: string;
  private activityTimeout: NodeJS.Timeout | null = null;
  private saveInterval: NodeJS.Timeout | null = null;
  private isActive: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.lastActivityTime = new Date();
    this.pagePath = window.location.pathname;
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private initializeTracking() {
    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, () => this.recordActivity());
    });

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveSession();
      } else {
        this.recordActivity();
      }
    });

    // Track route changes
    window.addEventListener('popstate', () => {
      this.updatePagePath();
    });

    // Save session periodically (every 30 seconds)
    this.saveInterval = setInterval(() => {
      if (this.isActive) {
        this.saveSession();
      }
    }, 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => {
      this.saveSession(true);
    });

    // Initial session record
    this.recordActivity();
    this.saveSession();
  }

  private recordActivity() {
    this.lastActivityTime = new Date();
    this.isActive = true;

    // Reset inactivity timeout
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }

    // Mark as inactive after 5 minutes of no activity
    this.activityTimeout = setTimeout(() => {
      this.isActive = false;
      this.saveSession();
    }, 5 * 60 * 1000);
  }

  private updatePagePath() {
    this.pagePath = window.location.pathname;
    this.saveSession();
  }

  private async saveSession(isFinal: boolean = false) {
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - this.startTime.getTime()) / 1000);

    try {
      const { error } = await supabase
        .from('session_time')
        .upsert({
          session_id: this.sessionId,
          start_time: this.startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_seconds: durationSeconds,
          page_path: this.pagePath,
          user_identifier: this.getUserIdentifier(),
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('Failed to save session time:', error);
      }
    } catch (err) {
      console.error('Error saving session:', err);
    }

    // If this is the final save, clean up
    if (isFinal) {
      this.cleanup();
    }
  }

  private getUserIdentifier(): string | null {
    // Generate a simple browser fingerprint
    const fingerprint = `${navigator.userAgent}-${screen.width}x${screen.height}`;
    return btoa(fingerprint).substring(0, 50);
  }

  private cleanup() {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }
}

// Initialize session tracking
let sessionTracker: SessionTracker | null = null;

export const initializeSessionTracking = () => {
  if (!sessionTracker) {
    sessionTracker = new SessionTracker();
  }
  return sessionTracker;
};
