import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/contexts/DemoDialogContext";

const CTASection = () => {
  const { setOpen } = useDemoDialog();
  return (
  <section id="contact" className="bg-hero section-padding">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl text-hero-foreground mb-6">
          Ready to bring your project to life?
        </h2>
        <p className="text-hero-muted text-lg mb-8 leading-relaxed">
          Book a free consultation and see how 3D visualisation can transform your next development.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base" onClick={() => setOpen(true)}>
            Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base">
            View Our Work
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

export default CTASection;
