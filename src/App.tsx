
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";
import Overview from "./routes/dashboard/Overview";
import DailyReports from "./routes/dashboard/DailyReports";
import Orders from "./routes/dashboard/Orders";
import Reservations from "./routes/dashboard/Reservations";
import Staff from "./routes/dashboard/Staff";
import Inventory from "./routes/dashboard/Inventory";
import Analytics from "./routes/dashboard/Analytics";
import Settings from "./routes/dashboard/Settings";
import Menu from "./routes/dashboard/Menu";
import Tables from "./routes/dashboard/Tables";
import Kitchen from "./routes/dashboard/Kitchen";
import Feedback from "./routes/dashboard/Feedback";
import Promotions from "./routes/dashboard/Promotions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="overview" element={<Overview />} />
                <Route path="daily-reports" element={<DailyReports />} />
                <Route path="orders" element={<Orders />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="staff" element={<Staff />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="menu" element={<Menu />} />
                <Route path="tables" element={<Tables />} />
                <Route path="kitchen" element={<Kitchen />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="promotions" element={<Promotions />} />
              </Route>
              <Route path="/features" element={<Features />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
