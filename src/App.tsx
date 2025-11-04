import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Results from "./pages/Results";
import Library from "./pages/Library";
import Announcements from "./pages/Announcements";
import Suggestions from "./pages/Suggestions";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import Messaging from "./pages/Messaging";
import WorkTracking from "./pages/WorkTracking";
import Courses from "./pages/Courses";
import Forums from "./pages/Forums";
import Wellness from "./pages/Wellness";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/results" element={<Results />} />
          <Route path="/library" element={<Library />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/work-tracking" element={<WorkTracking />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/wellness" element={<Wellness />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
