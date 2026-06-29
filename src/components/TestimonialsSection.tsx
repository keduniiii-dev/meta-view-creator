import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The interactive walkthrough gave our planning committee the clarity they needed. Decisions that usually take months were made in a single session.",
    name: "Helena Whitcombe",
    role: "Head of Planning",
    company: "Borough Regeneration Office",
  },
  {
    quote:
      "Investor confidence shifted the moment we shared the immersive visualisation. We pre-sold 38% of units before breaking ground.",
    name: "Marcus Adeyemi",
    role: "Development Director",
    company: "Northbank Living",
  },
  {
    quote:
      "Stakeholders finally aligned on a single shared model. Fewer revisions, faster sign-off and a noticeably calmer programme.",
    name: "Priya Sundaram",
    role: "Project Architect",
    company: "Westbridge Studio",
  },
];

const TestimonialsSection = () => (
  <section
    aria-label="Client testimonials"
    className="bg-background py-16 md:py-24"
  >
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl text-foreground mb-3 text-balance">
          Trusted by teams shaping the built environment
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Real outcomes from planning officers, developers and architects we work with.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-6">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border border-border bg-card p-6 md:p-7 shadow-card flex flex-col"
          >
            <Quote
              className="h-7 w-7 text-primary/40 mb-3"
              aria-hidden="true"
            />
            <blockquote className="text-foreground text-base leading-relaxed text-pretty flex-1">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-5 pt-5 border-t border-border/60">
              <div className="font-semibold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">
                {t.role} · {t.company}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
