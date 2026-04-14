import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Share Your Plans", desc: "Send us your blueprints, CAD files, or even sketches. We work with what you have." },
  { number: "02", title: "We Build in 3D", desc: "Our team creates photorealistic 3D models and interactive walkthroughs of your project." },
  { number: "03", title: "Review & Refine", desc: "We collaborate with you to perfect every detail until it matches your vision." },
  { number: "04", title: "Present & Win", desc: "Use your 3D visuals to win approvals, impress investors, and sell off-plan." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
        <h2 className="text-3xl md:text-4xl text-foreground">From blueprint to breathtaking in 4 steps</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <span className="text-6xl font-extrabold text-primary/10 font-heading">{s.number}</span>
            <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
