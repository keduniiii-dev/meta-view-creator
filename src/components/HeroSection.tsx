import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-3d.jpg";
import { useDemoDialog } from "@/contexts/DemoDialogContext";

const HeroSection = () => {
  const { setOpen } = useDemoDialog();
  return (
    <section className="bg-hero pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
    <div className="container grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-hero-foreground">
          We help developers and architects{" "}
          <span className="text-gradient">visualise projects in 3D</span>
        </h1>
        <p className="mt-6 text-hero-muted text-lg md:text-xl max-w-lg leading-relaxed">
          Speed up approvals, improve stakeholder communication, and bring your developments to life — before a single brick is laid.
        </p>

        <ul className="mt-6 space-y-3">
          {[
            "Photorealistic 3D renders & walkthroughs",
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
            Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-hero-muted/30 text-hero-foreground hover:bg-hero-muted/10">
            View Case Studies
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <img
          src={heroImg}
          alt="3D architectural visualisation of a modern development project"
          className="rounded-2xl shadow-2xl w-full"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-hero-muted/10" />
      </motion.div>
    </div>
  );
};

export default HeroSection;
