import { motion } from "framer-motion";
import { FaHardHat, FaClock, FaCommentSlash } from "react-icons/fa";

const problems = [
  {
    icon: FaHardHat,
    title: "Planning Approval Challenges",
    description: "Traditional 2D plans often fail to communicate scale, context, and design intent, increasing the likelihood of planning queries, revisions, and approval delays.",
  },
  {
    icon: FaClock,
    title: "Extended Approval Timelines",
    description: "When stakeholders cannot easily interpret project documentation, approval processes become longer and more complex.",
  },
  {
    icon: FaCommentSlash,
    title: "Stakeholder Misalignment",
    description: "Different project stakeholders often interpret plans differently, creating uncertainty, additional revisions, and delayed decision-making.",
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
        <h2 className="text-3xl md:text-4xl text-foreground mb-4">Are technical drawings giving every stakeholder the clarity they need?</h2>
        <p className="text-muted-foreground text-lg">
          Miscommunication and delayed decisions can add cost, risk and time to development programmes.
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
