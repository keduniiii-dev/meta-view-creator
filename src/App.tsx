import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BookDemoDialog from "@/components/BookDemoDialog";
import Index from "./pages/Index";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import LearnMoreCaseStudy from "./pages/LearnMoreCaseStudy";
import { AuthProvider } from "./hooks/useAuth";
import { crmPath, isCrmHost } from "./lib/crm-base";
import CrmLayout from "./crm/layout/CrmLayout";
import Login from "./crm/pages/Login";
import ProtectedRoute from "./crm/components/ProtectedRoute";
import CrmHome from "./crm/pages/Home";
import CrmDashboard from "./crm/pages/Dashboard";
import CrmLeads from "./crm/pages/Leads";
import CrmArchivedLeads from "./crm/pages/ArchivedLeads";
import CrmPipeline from "./crm/pages/Pipeline";
import CrmCapture from "./crm/pages/Capture";
import CrmOutreach from "./crm/pages/Outreach";
import CrmAnalytics from "./crm/pages/Analytics";
import CrmEmea from "./crm/pages/Emea";
import CrmAmericas from "./crm/pages/Americas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider><TooltipProvider><Sonner /><BrowserRouter>
      <Routes>
        {!isCrmHost() && <>
        <Route path="/" element={<Index />} /><Route path="/services" element={<Services />} /><Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:id" element={<LearnMoreCaseStudy />} /><Route path="/blog" element={<Blog />} /><Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} /><Route path="/faq" element={<FAQ />} /><Route path="/privacy-policy" element={<PrivacyPolicy />} /><Route path="/terms" element={<Terms />} />
        </>}
        <Route path={crmPath("/login")} element={<Login />} /><Route path={crmPath()} element={<ProtectedRoute />}><Route element={<CrmLayout />}>
          <Route index element={<CrmHome />} /><Route path="dashboard" element={<CrmDashboard />} /><Route path="leads" element={<CrmLeads />} /><Route path="archived" element={<CrmArchivedLeads />} /><Route path="pipeline" element={<CrmPipeline />} /><Route path="capture" element={<CrmCapture />} /><Route path="outreach" element={<CrmOutreach />} /><Route path="analytics" element={<CrmAnalytics />} /><Route path="emea" element={<CrmEmea />} /><Route path="americas" element={<CrmAmericas />} />
        </Route></Route><Route path="*" element={<NotFound />} />
      </Routes><BookDemoDialog />
    </BrowserRouter></TooltipProvider></AuthProvider>
  </QueryClientProvider>
);

export default App;
