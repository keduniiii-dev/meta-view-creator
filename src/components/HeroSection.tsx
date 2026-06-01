import { motion } from "framer-motion";
import { FaArrowRight, FaExpand } from "react-icons/fa";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-3d.jpg";
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const HeroSection = () => {
  const { setOpen } = useDemoDialogStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : e;
    const x = ((point.clientX - rect.left) / rect.width) * 100;
    const y = ((point.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };
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
          <span className="text-gradient">visualise projects in metaverse</span>
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
        style={{ perspective: 1200 }}
      >
        <motion.img
          src={heroImg}
          alt="metaverse architectural visualisation of a modern development project"
          className="rounded-2xl shadow-2xl w-full"
          width={1280}
          height={800}
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: 360,
            filter: [
              "brightness(1.5) contrast(1.15)",
              "brightness(1.1) contrast(1.05)",
              "brightness(0.7) contrast(0.95)",
              "brightness(1.1) contrast(1.05)",
              "brightness(1.5) contrast(1.15)",
            ],
          }}
          transition={{
            rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
            filter: {
              duration: 12,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.25, 0.5, 0.75, 1],
            },
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.7), transparent 65%)",
              "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 65%)",
              "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.0), transparent 65%)",
              "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 65%)",
              "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.7), transparent 65%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-hero-muted/10 pointer-events-none" />
      </motion.div>
    </div>
    </section>
  );
};

export default HeroSection;
