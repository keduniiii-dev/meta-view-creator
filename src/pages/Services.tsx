import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaCube, FaUsers, FaChartLine, FaPaintBrush, FaClock, FaShieldAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: FaCube,
    title: "3D Visualization",
    description: "Photorealistic 3D renders of your architectural projects, bringing designs to life before construction begins.",
    features: ["High-fidelity renders", "Multiple viewing angles", "Environmental context"],
  },
  {
    icon: FaUsers,
    title: "Stakeholder Presentations",
    description: "Interactive walkthroughs and presentations tailored for planning committees, investors, and community consultations.",
    features: ["Custom animations", "Real-time adjustments", "Multi-format delivery"],
  },
  {
    icon: FaChartLine,
    title: "Planning Approval Support",
    description: "Comprehensive visual documentation to accelerate planning approvals and reduce rejection cycles.",
    features: ["Compliance documentation", "Impact analysis visuals", "Regulatory alignment"],
  },
  {
    icon: FaPaintBrush,
    title: "Design Iteration",
    description: "Rapid visualization of design alternatives, enabling faster decision-making and design refinement.",
    features: ["Quick turnarounds", "Multiple variants", "Version control"],
  },
  {
    icon: FaClock,
    title: "Timeline Acceleration",
    description: "Cut approval timelines by months through clear visual communication that eliminates ambiguity.",
    features: ["Faster consensus", "Reduced delays", "Early visibility"],
  },
  {
    icon: FaShieldAlt,
    title: "Risk Mitigation",
    description: "Identify potential issues early through comprehensive visualization and stakeholder alignment.",
    features: ["Issue identification", "Stakeholder buy-in", "Project confidence"],
  },
];

const process = [
  {
    step: 1,
    title: "Initial Consultation",
    description: "Understand your project scope, timeline, and specific visualization requirements.",
  },
  {
    step: 2,
    title: "Data Gathering",
    description: "Collect architectural plans, site data, and contextual information to build accurate models.",
  },
  {
    step: 3,
    title: "3D Modeling",
    description: "Create detailed 3D models with photorealistic rendering and environmental integration.",
  },
  {
    step: 4,
    title: "Refinement & Delivery",
    description: "Incorporate feedback and deliver final visualizations in your preferred formats.",
  },
];

const Services = () => {
  const { setOpen } = useDemoDialogStore();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-hero-foreground mb-6">
                Our <span className="text-gradient">Services</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Comprehensive 3D visualization and architectural communication solutions designed to accelerate your project approvals and stakeholder alignment.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">What We Offer</h2>
              <p className="text-muted-foreground text-lg">
                Tailored solutions for every stage of your architectural project
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">Our Process</h2>
              <p className="text-muted-foreground text-lg">
                A streamlined approach to delivering exceptional 3D visualizations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {process.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-center"
                >
                  <div className="bg-card rounded-2xl p-6 border border-border h-full w-full">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 mt-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {i < process.length - 1 && (
                    <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-hero section-padding">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl text-hero-foreground mb-6">
                Ready to get started?
              </h2>
              <p className="text-hero-muted text-lg mb-8 leading-relaxed">
                Let's discuss how our visualization services can transform your next project.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base"
                onClick={() => setOpen(true)}
              >
                Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
