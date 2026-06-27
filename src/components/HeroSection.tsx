import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import VirtualTour from "@/components/VirtualTour";
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const HeroSection = () => {
  const { setOpen } = useDemoDialogStore();
  return (
    <section className="bg-hero pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
    <div className="container grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-hero-foreground text-balance">
          Digital visualisation for <span className="text-gradient">property infrastructure and planning projects</span>
        </h1>
        <p className="mt-6 text-hero-muted text-lg md:text-xl max-w-lg leading-relaxed">
          Speed up approvals, improve stakeholder communication, and bring your developments to life before a single brick is laid.
        </p>

        <ul className="mt-6 space-y-3">
          {[
            "Photorealistic metaverse renders & walkthroughs",
            "Faster planning approvals with visual clarity",
            "Better communication across every stakeholder",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-hero-muted text-sm md:text-base">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base" onClick={() => setOpen(true)}>
            Book a Demo <FaArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base" asChild>
            <a href="#case-studies">View Case Studies</a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl aspect-[16/10] group bg-muted">
          <VirtualTour />

          {/* Virtual tour HUD */}
          <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-foreground shadow pointer-events-none">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Virtual Tour · Floor 24
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-background/70 backdrop-blur px-3 py-1.5 text-xs text-foreground/80 shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Drag to look around · Scroll to zoom
          </div>

          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-hero-muted/10 pointer-events-none" />
        </div>
      </motion.div>
    </div>
    </section>
  );
};

export default HeroSection;
