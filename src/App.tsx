import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// Temporarily disabled due to Three.js dependency issue
// import DigitalTwin from "./pages/DigitalTwin";
import Procurement from "./pages/Procurement";
import Workforce from "./pages/Workforce";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Temporary placeholder for Digital Twin
const DigitalTwinPlaceholder = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">Digital Twin</h1>
      <p className="text-muted-foreground">3D visualization temporarily disabled - fixing dependencies...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/digital-twin" element={<DigitalTwinPlaceholder />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/workforce" element={<Workforce />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
