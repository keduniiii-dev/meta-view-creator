import { motion } from "framer-motion";
import { Eye, Zap, Users, CheckCircle } from "lucide-react";

const features = [
  { icon: Eye, title: "3D Visualisation", desc: "Photorealistic renders and interactive 3D walkthroughs of your project." },
  { icon: Zap, title: "Faster Approvals", desc: "Help planning officers instantly understand your development." },
  { icon: Users, title: "Stakeholder Alignment", desc: "Get everyone — investors, buyers, councils — on the same page." },
  { icon: CheckCircle, title: "Better Decisions", desc: "Spot design issues early, saving time and money on revisions." },
];

const SolutionSection = () => (
  <section id="services" className="section-padding bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Our Solution</p>
        <h2 className="text-3xl md:text-4xl text-foreground">
          3D experiences that win approvals
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          We transform your plans into stunning, interactive 3D visualisations — so every stakeholder sees exactly what you're building.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-muted rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <f.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
