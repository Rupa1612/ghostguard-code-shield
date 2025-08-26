import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/shared/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { ScanPage } from "@/pages/ScanPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { RedactPage } from "@/pages/RedactPage";
import { RulesPage } from "@/pages/RulesPage";
import { ActivityPage } from "@/pages/ActivityPage";
import { SettingsPage } from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="scans" element={<ResultsPage />} />
            <Route path="redact" element={<RedactPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
