import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-3d.jpg";
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const SPEEDS = [
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
];
const BASE_DURATION = 12;

const HeroSection = () => {
  const { setOpen } = useDemoDialogStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const duration = BASE_DURATION / speed;

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
          animate={
            isPlaying
              ? {
                  rotateY: 360,
                  filter: [
                    "brightness(1.5) contrast(1.15)",
                    "brightness(1.1) contrast(1.05)",
                    "brightness(0.7) contrast(0.95)",
                    "brightness(1.1) contrast(1.05)",
                    "brightness(1.5) contrast(1.15)",
                  ],
                }
              : { rotateY: 0, filter: "brightness(1) contrast(1)" }
          }
          transition={
            isPlaying
              ? {
                  rotateY: { duration, repeat: Infinity, ease: "linear" },
                  filter: {
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.25, 0.5, 0.75, 1],
                  },
                }
              : { duration: 0.4 }
          }
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay"
          animate={
            isPlaying
              ? {
                  background: [
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.7), transparent 65%)",
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 65%)",
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.0), transparent 65%)",
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 65%)",
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.7), transparent 65%)",
                  ],
                }
              : { background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0), transparent 65%)" }
          }
          transition={
            isPlaying
              ? { duration, repeat: Infinity, ease: "linear", times: [0, 0.25, 0.5, 0.75, 1] }
              : { duration: 0.4 }
          }
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-hero-muted/10 pointer-events-none" />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-background/70 backdrop-blur-md px-3 py-2 shadow-lg ring-1 ring-border">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex items-center gap-1" role="group" aria-label="Rotation speed">
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSpeed(s.value)}
                aria-pressed={speed === s.value}
                className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                  speed === s.value
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
    </section>
  );
};

export default HeroSection;
