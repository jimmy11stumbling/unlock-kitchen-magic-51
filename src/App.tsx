
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AIAssistant } from "@/components/AIAssistant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIAssistant />
    </Router>
  );
}

export default App;
