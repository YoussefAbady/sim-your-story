import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocaleProvider } from "./contexts/LocaleContext";
import { initializeSessionTracking } from "./services/sessionTracker";
import { supabase } from "./integrations/supabase/client";

// Initialize session tracking
initializeSessionTracking();

// Seed demo data on first load (production only)
const seedDemoDataOnce = async () => {
  const SEED_KEY = 'demo_seeded_v1';
  
  if (!localStorage.getItem(SEED_KEY)) {
    try {
      console.log('First load detected, seeding demo data...');
      const { data, error } = await supabase.functions.invoke('seed-demo');
      
      if (error) {
        console.error('Error seeding demo data:', error);
      } else {
        console.log('Demo data seeding result:', data);
        localStorage.setItem(SEED_KEY, 'true');
      }
    } catch (error) {
      console.error('Failed to call seed-demo function:', error);
    }
  }
};

// Run seeding in production
if (import.meta.env.PROD) {
  seedDemoDataOnce();
}

createRoot(document.getElementById("root")!).render(
  <LocaleProvider>
    <App />
  </LocaleProvider>
);
