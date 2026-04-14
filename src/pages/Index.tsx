import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BookDemoDialog from "@/components/BookDemoDialog";
import { DemoDialogProvider, useDemoDialog } from "@/contexts/DemoDialogContext";

const IndexContent = () => {
  const { open, setOpen } = useDemoDialog();
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CaseStudiesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
      <BookDemoDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

const Index = () => (
  <DemoDialogProvider>
    <IndexContent />
  </DemoDialogProvider>
);

export default Index;
