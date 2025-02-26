
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
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
import { i18n } from "@/services/i18n/i18n";
import { MetaTags } from "@/components/seo/MetaTags";

function App() {
  useEffect(() => {
    // Initialize services
    logger.info('Application started');
    performanceMonitor.trackCustomMetric('app_init', performance.now());

    // Initialize language from preference
    const preferredLanguage = localStorage.getItem('preferred-language');
    if (preferredLanguage) {
      i18n.setLanguage(preferredLanguage as any);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then(registration => {
            logger.info('ServiceWorker registration successful:', registration);
          })
          .catch(error => {
            logger.error('ServiceWorker registration failed:', error);
          });
      });
    }

    // Error handlers
    const handleError = (event: ErrorEvent) => {
      logger.error('Unhandled error:', {
        message: event.message,
        stack: event.error?.stack
      });
    };

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
    <HelmetProvider>
      <ErrorBoundary>
        <MetaTags
          title="Restaurant Management App"
          description="Efficient restaurant management system for orders, inventory, and staff"
          keywords="restaurant,management,orders,inventory,staff"
          ogImage="/og-image.png"
        />
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
    </HelmetProvider>
  );
}

export default App;
