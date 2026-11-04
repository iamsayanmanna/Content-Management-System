
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import TemplatesPage from "./pages/TemplatesPage";
import PricingPage from "./pages/PricingPage";
import ResourcesPage from "./pages/ResourcesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/features" element={<FeaturesPage />} />

      {/* Other pages will be added later */}
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
