import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import { Features } from "@/components/Features";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { performanceMonitor } from "@/services/monitoring/performance";
import { logger } from "@/services/logging/logger";

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    logger.info('Application started');
    performanceMonitor.trackCustomMetric('app_init', performance.now());

    // Listen for unhandled errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Unhandled error:', {
        message: event.message,
        stack: event.error?.stack
      });
    };

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection:', {
        reason: event.reason
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features showViewAllButton={true} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:tab" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
