import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BookDemoDialog from "@/components/BookDemoDialog";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO
        title="Twinblueprint | Immersive Property Visualisation & Digital Twins"
        description="Digital visualisation for property, infrastructure and planning projects. Speed up approvals and align every stakeholder with photorealistic renders and immersive walkthroughs."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Twinblueprint",
          url: "https://meta-view-creator.lovable.app/",
        }}
      />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CaseStudiesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
      <BookDemoDialog />
    </>
  );
};

export default Index;
