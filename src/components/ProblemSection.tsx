import { motion } from "framer-motion";
import { FaHardHat, FaClock, FaCommentSlash } from "react-icons/fa";

const problems = [
  {
    icon: FaHardHat,
    title: "Planning Rejections",
    description: "Traditional 2D blueprints fail to communicate your vision, leading to costly delays and rejected applications.",
  },
  {
    icon: FaClock,
    title: "Slow Approvals",
    description: "Stakeholders struggle to understand flat plans, causing endless back-and-forth and months of wasted time.",
  },
  {
    icon: FaCommentSlash,
    title: "Poor Communication",
    description: "Investors, councils, and buyers can't see what you see - misalignment kills deals before they start.",
  },
];

const ProblemSection = () => (
  <section className="section-padding bg-muted">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">The Problem</p>
        <h2 className="text-3xl md:text-4xl text-foreground">
          Still relying on flat blueprints?
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          The construction industry loses billions every year to miscommunication and delayed approvals.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <p.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl text-foreground mb-3">{p.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{p.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
