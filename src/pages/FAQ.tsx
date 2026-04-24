import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "What file formats do you accept?",
    answer:
      "We accept a wide range of formats including DWG, DXF, PDF, SketchUp (.skp), Revit (.rvt), AutoCAD files, Rhino, 3ds Max, as well as standard image formats like JPG and PNG. If you have plans in other formats, contact us and we'll find a way to work with them.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Turnaround times vary based on project complexity. A single-property visualization typically takes 5-7 business days, while larger developments may take 2-4 weeks. We always agree on deadlines upfront and offer rush delivery for urgent requirements.",
  },
  {
    question: "Can I request changes to the visualization?",
    answer:
      "Absolutely. We include multiple revision rounds in every project. You'll have opportunities to request changes to materials, lighting, surrounding landscaping, and any other elements until you're completely satisfied with the result.",
  },
  {
    question: "What's included in the final deliverables?",
    answer:
      "Each project includes high-resolution images (print-ready), interactive 3D walkthroughs, VR-ready exports if requested, and a comprehensive usage license. Marketing teams love the versatility of having assets ready for web, print, and immersive presentations.",
  },
  {
    question: "Do you offer ongoing support after project delivery?",
    answer:
      "Yes. We provide 30 days of complimentary support after delivery for any adjustments you might need. For ongoing projects or long-term partnerships, we also offer retainer arrangements with priority turnaround and dedicated account management.",
  },
  {
    question: "How do you handle confidentiality?",
    answer:
      "We take confidentiality seriously. All project files are stored securely and never shared with third parties. We can sign NDAs and have strict internal policies to ensure your project's intellectual property remains protected throughout and after our engagement.",
  },
  {
    question: "What's your pricing structure?",
    answer:
      "Pricing depends on property type, complexity, and deliverables required. We offer competitive rates for single properties and attractive volume discounts for developers with multiple units. Contact us for a customized quote based on your specific requirements.",
  },
  {
    question: "Can you match existing brand guidelines?",
    answer:
      "Yes. We can match any brand guidelines, color palettes, or style preferences. Just provide your brand assets and we'll ensure consistency across all visualizations, whether for internal presentations or external marketing materials.",
  },
];

const FAQ = () => {
  const { setOpen } = useDemoDialogStore();
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

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
                Frequently Asked <span className="text-gradient">Questions</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Find answers to common questions about our 3D visualization services, process, and deliverables.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Accordion
                type="single"
                collapsible
                value={openItem}
                onValueChange={setOpenItem}
                className="w-full"
              >
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${i}`}
                      className="bg-card rounded-xl mb-4 border border-border overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-5 text-left text-foreground font-semibold hover:no-underline hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Can't find the answer you're looking for? Our team is happy to help with any questions you might have.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base"
                onClick={() => setOpen(true)}
              >
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;