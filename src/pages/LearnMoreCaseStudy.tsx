import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDemoDialog from "@/components/BookDemoDialog";
import caseStudy1 from "@/assets/case-study-1.jpg";
import caseStudy2 from "@/assets/case-study-2.jpg";

const caseStudiesData = {
  1: {
    id: 1,
    image: caseStudy1,
    category: "Residential",
    title: "Riverside Apartments - 40% Faster Approval",
    location: "London, UK",
    developer: "Thames Development Co.",
    year: "2025",
    timeline: "8 weeks",
    challenge: "A developer struggled with multiple planning rejections for a 200-unit residential project. The local planning authority had concerns about the visual impact and integration with the surrounding Victorian buildings.",
    solution: "We created photorealistic 3D walkthroughs showing the development in context with its surroundings. The visualization included seasonal variations and different times of day to demonstrate how the building would integrate with the neighborhood.",
    result: "Planning approval granted on first resubmission, saving 6 months and £120K in delays.",
    services: ["3D Visualization", "Interactive Walkthroughs", "Contextual Renders", "VR Experience"],
    metrics: [
      { label: "Time Saved", value: "6 months" },
      { label: "Cost Saved", value: "£120K" },
      { label: "Units", value: "200+" },
      { label: "Approval", value: "First try" },
    ],
    gallery: [caseStudy1, caseStudy2],
  },
  2: {
    id: 2,
    image: caseStudy2,
    category: "Infrastructure",
    title: "City Bridge Project - Stakeholder Buy-In",
    location: "Manchester, UK",
    developer: "UK Infrastructure Partners",
    year: "2025",
    timeline: "6 weeks",
    challenge: "A local authority couldn't align 12 stakeholder groups on a major infrastructure project. Each group had different concerns and priorities.",
    solution: "Interactive 3D model with flythrough animations presented at council meetings. Different stakeholder versions highlighted relevant considerations for transport, environment, and community groups.",
    result: "Unanimous stakeholder approval achieved in a single session - a first for the authority.",
    services: ["3D Modeling", "Interactive Presentations", "Stakeholder Tools", "VR Walkthroughs"],
    metrics: [
      { label: "Stakeholders", value: "12" },
      { label: "Approval Time", value: "1 session" },
      { label: "Success Rate", value: "100%" },
      { label: "Project Type", value: "Bridge" },
    ],
    gallery: [caseStudy2, caseStudy1],
  },
};

const LearnMoreCaseStudy = () => {
  const { id } = useParams();
  const studyId = parseInt(id || "1");
  const study = caseStudiesData[studyId as keyof typeof caseStudiesData] || caseStudiesData[1];
  const { setOpen } = useDemoDialogStore();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero pt-32 pb-12">
          <div className="container">
            <Link to="/case-studies">
              <Button variant="ghost" className="mb-6 text-hero-muted hover:text-hero-foreground pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case Studies
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-0">
                {study.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-hero-foreground mb-4">
                {study.title}
              </h1>
              <p className="text-hero-muted text-lg mb-6">
                📍 {study.location} • {study.developer} • {study.year}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Image */}
        <section className="pb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-background">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">The Challenge</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {study.challenge}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Solution</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {study.solution}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">The Result</h2>
                  <p className="text-primary text-xl font-semibold">
                    {study.result}
                  </p>
                </motion.div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-muted rounded-2xl p-6 sticky top-24"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4">Project Details</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Timeline</p>
                      <p className="font-semibold text-foreground">{study.timeline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Services Provided</p>
                      <ul className="space-y-2 mt-2">
                        {study.services.map((service) => (
                          <li key={service} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                    onClick={() => setOpen(true)}
                  >
                    Request a Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="section-padding bg-muted">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Key Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {study.metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background rounded-xl p-6 text-center border border-border"
                >
                  <p className="text-3xl font-bold text-primary mb-2">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-hero section-padding">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl text-hero-foreground mb-6">
                Ready to transform your project?
              </h2>
              <p className="text-hero-muted text-lg mb-8 leading-relaxed">
                Let's discuss how our 3D visualization services can help you achieve faster approvals.
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
      <BookDemoDialog />
    </>
  );
};

export default LearnMoreCaseStudy;