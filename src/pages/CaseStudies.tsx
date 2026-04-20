import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoDialog } from "@/contexts/DemoDialogContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import caseStudy1 from "@/assets/case-study-1.jpg";
import caseStudy2 from "@/assets/case-study-2.jpg";

const caseStudies = [
  {
    id: 1,
    image: caseStudy1,
    category: "Residential",
    title: "Riverside Apartments - 40% Faster Approval",
    location: "London, UK",
    developer: "Thames Development Co.",
    challenge: "A developer struggled with multiple planning rejections for a 200-unit residential project. The local planning authority had concerns about the visual impact and integration with the surrounding Victorian buildings.",
    solution: "We created photorealistic 3D walkthroughs showing the development in context with its surroundings. The visualization included seasonal variations and different times of day to demonstrate how the building would integrate with the neighborhood.",
    result: "Planning approval granted on first resubmission, saving 6 months and £120K in delays.",
    metrics: [
      { label: "Time Saved", value: "6 months" },
      { label: "Cost Saved", value: "£120K" },
      { label: "Units", value: "200+" },
    ],
  },
  {
    id: 2,
    image: caseStudy2,
    category: "Infrastructure",
    title: "City Bridge Project - Stakeholder Buy-In",
    location: "Manchester, UK",
    developer: "UK Infrastructure Partners",
    challenge: "A local authority couldn't align 12 stakeholder groups on a major infrastructure project. Each group had different concerns and priorities.",
    solution: "Interactive 3D model with flythrough animations presented at council meetings. Different stakeholder versions highlighted relevant considerations for transport, environment, and community groups.",
    result: "Unanimous stakeholder approval achieved in a single session - a first for the authority.",
    metrics: [
      { label: "Stakeholders", value: "12" },
      { label: "Approval Time", value: "1 session" },
      { label: "Success Rate", value: "100%" },
    ],
  },
];

const CaseStudies = () => {
  const { setOpen } = useDemoDialog();

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
                Case <span className="text-gradient">Studies</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Real projects, real results. See how our 3D visualizations have transformed approval timelines and stakeholder communication across the UK.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="section-padding bg-background">
          <div className="container">
            <div className="space-y-16">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  {/* Image */}
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover"
                        width={800}
                        height={600}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <Badge className="mb-4 bg-primary/10 text-primary border-0">
                      {study.category}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                      {study.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      📍 {study.location} • {study.developer}
                    </p>

                    <div className="space-y-6 mb-8">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Challenge</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Solution</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {study.solution}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Result</h3>
                        <p className="text-primary font-semibold">
                          {study.result}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-muted rounded-xl">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className="text-2xl font-bold text-primary">
                            {metric.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
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
                Ready to be a case study?
              </h2>
              <p className="text-hero-muted text-lg mb-8 leading-relaxed">
                Let's discuss how our 3D visualization services can accelerate your next project.
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

export default CaseStudies;
