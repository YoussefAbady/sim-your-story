import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocaleProvider } from "./contexts/LocaleContext";
import { initializeSessionTracking } from "./services/sessionTracker";

// Initialize session tracking
initializeSessionTracking();

createRoot(document.getElementById("root")!).render(
  <LocaleProvider>
    <App />
  </LocaleProvider>
);
