import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EducationProvider } from "@/contexts/EducationContext";
import { EducationTipDisplay } from "@/components/education/EducationTipDisplay";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { BadgeCollection } from "@/components/gamification/BadgeCollection";
import { SessionSummary } from "@/components/gamification/SessionSummary";
import Index from "./pages/Index";
import Simulation from "./pages/Simulation";
import Results from "./pages/Results";
import ReportView from "./pages/ReportView";
import AdminReports from "./pages/AdminReports";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GamificationProvider>
      <EducationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <EducationTipDisplay />
          <BadgeCollection />
          <SessionSummary />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/results" element={<Results />} />
              <Route path="/report" element={<ReportView />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </EducationProvider>
    </GamificationProvider>
  </QueryClientProvider>
);

export default App;
