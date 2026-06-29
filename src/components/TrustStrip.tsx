import { motion } from "framer-motion";
import { ShieldCheck, Building2, Landmark, Layers3, Hammer, Trees } from "lucide-react";

const items = [
  { icon: Building2, label: "Residential developers" },
  { icon: Landmark, label: "Planning authorities" },
  { icon: Hammer, label: "Construction & infrastructure" },
  { icon: Layers3, label: "BIM & design teams" },
  { icon: Trees, label: "Master planning" },
  { icon: ShieldCheck, label: "RIBA-aligned workflow" },
];

const TrustStrip = () => (
  <section
    aria-label="Trusted by"
    className="bg-background border-y border-border/60 py-6 md:py-8"
  >
    <div className="container">
      <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5">
        Built for property, planning and construction teams
      </p>
      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3"
      >
        {items.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Icon className="h-4 w-4 text-primary/80 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  </section>
);

export default TrustStrip;
