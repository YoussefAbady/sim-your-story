import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { EducationProvider } from "@/contexts/EducationContext";
import { EducationTipDisplay } from "@/components/education/EducationTipDisplay";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { BadgeCollection } from "@/components/gamification/BadgeCollection";
import { SessionSummary } from "@/components/gamification/SessionSummary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Simulator from "./pages/Simulator";
import Results from "./pages/Results";
import ReportView from "./pages/ReportView";
import AdminReports from "./pages/AdminReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <GamificationProvider>
          <EducationProvider>
            <TooltipProvider>
              <Sonner position="top-right" />
              <BadgeCollection />
              <SessionSummary />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/report/:id" element={<ReportView />} />
                  <Route path="/simulation" element={<Simulation />} />
                  <Route path="/simulator" element={<Simulator />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <EducationTipDisplay />
              </BrowserRouter>
            </TooltipProvider>
          </EducationProvider>
        </GamificationProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};

export default App;
