import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DigitalTwin from "./pages/DigitalTwin";
import Procurement from "./pages/Procurement";
import FactoryOptions from "./pages/FactoryOptions";
import Orders from "./pages/Orders";
import Workforce from "./pages/Workforce";
import FileViewer from "./pages/FileViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/factory-options" element={<FactoryOptions />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/file-viewer" element={<FileViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
