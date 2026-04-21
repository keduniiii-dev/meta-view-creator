import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services. Our services are intended for users who are 18 years of age or older.",
  },
  {
    title: "Description of Services",
    content:
      "Meta-dology provides 3D architectural visualization services, including but not limited to: photorealistic rendering, 3D modeling, interactive walkthroughs, and VR-ready content. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.",
  },
  {
    title: "User Responsibilities",
    content:
      "You agree to: provide accurate and complete information when using our services; protect the confidentiality of any login credentials; comply with all applicable laws and regulations; not use our services for any unlawful or prohibited purpose; and not interfere with or disrupt our services or servers.",
  },
  {
    title: "Intellectual Property Rights",
    content:
      "All content, designs, and materials provided through our services are protected by intellectual property rights. You retain ownership of any designs and materials you provide to us. We retain ownership of our pre-existing assets, techniques, and general methodologies. Specific deliverables created for you become your property upon full payment.",
  },
  {
    title: "Confidentiality",
    content:
      "We treat all project information as confidential and do not disclose it to third parties without your consent. Similarly, you agree to keep confidential any proprietary information, pricing, or methodologies we share with you during our engagement.",
  },
  {
    title: "Payment Terms",
    content:
      "Payment terms are agreed upon before project commencement. Typically, we require a 50% deposit with the balance due upon project completion. Late payments may incur interest charges. We reserve the right to withhold deliverables until full payment is received.",
  },
  {
    title: "Revisions and Refunds",
    content:
      "We include a reasonable number of revisions in each project as specified in our proposal. Additional revisions beyond the agreed scope may incur additional charges. Due to the nature of creative services, all sales are final once deliverables have been approved and delivered.",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the fullest extent permitted by law, Meta-dology shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.",
  },
  {
    title: "Indemnification",
    content:
      "You agree to indemnify and hold harmless Meta-dology, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these terms, your use of our services, or your violation of any rights of a third party.",
  },
  {
    title: "Termination",
    content:
      "Either party may terminate an engagement with 30 days written notice. Upon termination: you will pay for all services rendered up to the termination date; we will deliver all completed work to you; and both parties will return or destroy confidential information of the other party.",
  },
  {
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Meta-dology operates, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved through binding arbitration or mediation.",
  },
  {
    title: "Modifications to Terms",
    content:
      "We reserve the right to modify these terms at any time. We will notify you of significant changes by posting the updated terms on our website. Your continued use of our services after any changes constitutes acceptance of the modified terms.",
  },
  {
    title: "Contact Information",
    content:
      "If you have any questions about these Terms of Service, please contact us at hello@meta-dology.com. We will endeavor to respond to your inquiry as soon as possible.",
  },
];

const Terms = () => {
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
                Terms of <span className="text-gradient">Service</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Please read these terms carefully before using our services. They outline the rules and guidelines for using Meta-dology.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-muted-foreground mb-12 pb-8 border-b border-border"
              >
                <strong>Last Updated:</strong> April 21, 2026
              </motion.p>

              {sections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="mb-10"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Terms;