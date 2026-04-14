import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import caseStudy1 from "@/assets/case-study-1.jpg";
import caseStudy2 from "@/assets/case-study-2.jpg";

const studies = [
  {
    image: caseStudy1,
    tag: "Residential",
    title: "Riverside Apartments - 40% Faster Approval",
    problem: "A developer struggled with multiple planning rejections for a 200-unit residential project.",
    solution: "We created photorealistic 3D walkthroughs showing the development in context with its surroundings.",
    result: "Planning approval granted on first resubmission, saving 6 months and £120K in delays.",
  },
  {
    image: caseStudy2,
    tag: "Infrastructure",
    title: "City Bridge Project - Stakeholder Buy-In",
    problem: "A local authority couldn't align 12 stakeholder groups on a major infrastructure project.",
    solution: "Interactive 3D model with flythrough animations presented at council meetings.",
    result: "Unanimous stakeholder approval achieved in a single session - a first for the authority.",
  },
];

const CaseStudiesSection = () => (
  <section id="case-studies" className="section-padding bg-muted">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Case Studies</p>
        <h2 className="text-3xl md:text-4xl text-foreground">Real results from real projects</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {studies.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group"
          >
            <div className="overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
            <div className="p-8">
              <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                {s.tag}
              </span>
              <h3 className="text-xl font-bold text-foreground mb-4">{s.title}</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Problem:</strong> {s.problem}</p>
                <p><strong className="text-foreground">Solution:</strong> {s.solution}</p>
                <p><strong className="text-foreground">Result:</strong> {s.result}</p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 mt-6 text-primary font-semibold text-sm hover:gap-3 transition-all">
                Read full case study <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CaseStudiesSection;
