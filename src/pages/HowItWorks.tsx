import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import propertyTourVideo from "@/assets/property-tour.mp4.asset.json";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start by understanding your project, stakeholders and approval pathway. Together we define how Immersive Property Visualisation outputs will support your planning, investment and delivery goals.",
    details: [
      "Project scope and stakeholder mapping",
      "Planning and approval pathway review",
      "Data, BIM and source asset audit",
      "Visualisation strategy and success measures",
    ],
  },
  {
    number: "02",
    title: "Project Development",
    description:
      "Our specialists build your Immersive Property Visualisation from architectural, engineering and site data. Every model is constructed with accurate geometry, materiality and context.",
    details: [
      "BIM and CAD integration",
      "Photorealistic materials and lighting",
      "Site, townscape and infrastructure context",
      "Interactive walkthrough authoring",
    ],
  },
  {
    number: "03",
    title: "Review & Collaboration",
    description:
      "You review your Immersive Property Visualisation with our team in structured sessions. We refine detail, resolve design questions and align the model with stakeholder requirements.",
    details: [
      "Collaborative review sessions",
      "Design and constructability feedback",
      "Iterative refinements",
      "Sign-off ready outputs",
    ],
  },
  {
    number: "04",
    title: "Delivery & Support",
    description:
      "We deliver planning-ready visuals, virtual walkthroughs and immersive assets in the formats your teams need. Ongoing support keeps your Immersive Property Visualisation current across the project lifecycle.",
    details: [
      "High-resolution renders and stills",
      "Interactive web walkthroughs",
      "VR and presentation-ready exports",
      "Long-term model updates",
    ],
  },
];

const benefits = [
  "Faster planning approvals",
  "Stronger stakeholder engagement",
  "Earlier design validation",
  "Improved investor confidence",
  "Sell off-plan properties 60% faster",
];

const HowItWorks = () => {
  const { setOpen } = useDemoDialogStore();

  return (
    <>
      <SEO
        title="How It Works | Our Visualisation Process | Twinblueprint"
        description="A four-step process from concept to construction. Discovery, project development, review and delivery of immersive property visualisation that accelerates approvals."
        path="/how-it-works"
      />
      <Navbar />
      <main>
        <section className="bg-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-hero-foreground mb-6">
                How It <span className="text-gradient">Works</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                A four-step process from concept to construction, built for architecture, construction, infrastructure, and planning teams. We translate complex projects into Immersive Property Visualisation that accelerates approvals and facilitates stakeholder alignment.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-8 border border-border"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-5xl font-extrabold text-primary/20 font-heading leading-none">
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                Why Choose Our Process
              </h2>
              <p className="text-muted-foreground text-lg">
                Our streamlined approach delivers measurable results for property developers and architects.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                Let's discuss your project and show you what's possible with stunning Immersive Property Visualisation.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base"
                onClick={() => setOpen(true)}
              >
                Book a Demo <FaArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HowItWorks;