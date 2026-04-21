import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/contexts/DemoDialogContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "01",
    title: "Share Your Plans",
    description:
      "Send us your blueprints, CAD files, or even rough sketches. We work with whatever format you have available. The more detail you can provide, the better we can bring your vision to life.",
    details: [
      "Architectural drawings (2D/3D)",
      "CAD files (AutoCAD, Revit, SketchUp)",
      "Reference images and mood boards",
      "Design briefs and specifications",
    ],
  },
  {
    number: "02",
    title: "We Build in 3D",
    description:
      "Our expert team creates photorealistic 3D models and interactive walkthroughs of your project. We pay meticulous attention to materials, lighting, and scale to deliver stunning realism.",
    details: [
      "Detailed 3D modeling",
      "Photorealistic rendering",
      "Realistic materials and textures",
      "Dynamic lighting simulation",
    ],
  },
  {
    number: "03",
    title: "Review & Refine",
    description:
      "We collaborate closely with you to perfect every detail. You'll receive regular updates and have full input until the result matches your exact vision.",
    details: [
      "Regular progress updates",
      "Interactive review sessions",
      "Multiple revision rounds",
      "Direct access to our team",
    ],
  },
  {
    number: "04",
    title: "Present & Win",
    description:
      "Receive your completed 3D visuals in multiple formats ready for any platform. Use them to win planning approvals, impress investors, and sell off-plan properties faster.",
    details: [
      "High-resolution images",
      "Interactive 3D walkthroughs",
      "VR-ready exports",
      "Marketing-ready assets",
    ],
  },
];

const benefits = [
  "Reduce approval times by up to 40%",
  "Increase investor engagement by 3x",
  "Sell off-plan properties 60% faster",
  "Reduce physical样板房 costs by 90%",
  "Win more planning applications",
  "Impress stakeholders with stunning visuals",
];

const HowItWorks = () => {
  const { setOpen } = useDemoDialog();

  return (
    <>
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
                From blueprint to breathtaking in four simple steps. We've streamlined the entire process to deliver stunning 3D visualizations with minimal effort on your end.
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
                Let's discuss your project and show you what's possible with stunning 3D visualization.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base"
                onClick={() => setOpen(true)}
              >
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
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