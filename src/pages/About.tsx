import { motion } from "framer-motion";
import { FaArrowRight, FaTrophy, FaUsers, FaGlobe, FaLightbulb } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "20+ years in architectural visualisation and digital twin technology. Former head of visualisation at a major UK architecture firm.",
  },
  {
    name: "James Murphy",
    role: "Chief Technology Officer",
    bio: "Expert in photorealistic rendering and real-time 3D. Previously led visualisation tech at a FTSE 100 company.",
  },
  {
    name: "Emma Lewis",
    role: "Head of Client Success",
    bio: "10+ years in client relations and project management. Passionate about delivering exceptional outcomes.",
  },
  {
    name: "David Patel",
    role: "Lead 3D Artist",
    bio: "Award-winning 3D artist specialising in architectural visualisation. Master's in Digital Architecture.",
  },
];

const values = [
  {
    icon: FaLightbulb,
    title: "Innovation",
    description: "We apply appropriate real-time, rendering and digital-twin technologies to solve project communication challenges.",
  },
  {
    icon: FaTrophy,
    title: "Excellence",
    description: "We're committed to delivering the highest quality visualisations that exceed expectations.",
  },
  {
    icon: FaUsers,
    title: "Collaboration",
    description: "We work closely with our clients to translate the project vision into accurate, engaging visual material.",
  },
  {
    icon: FaGlobe,
    title: "Sustainability",
    description: "We're dedicated to supporting sustainable development through better visualisation and communication.",
  },
];

const About = () => {
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
                About <span className="text-gradient">Twinblueprint</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Transforming how the world visualises architectural projects through cutting-edge digital twin technology and exceptional service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-background">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  To support the architectural industry by making photorealistic immersive visualisation accessible and affordable for developers, architects, and urban planners worldwide.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We believe that better visualisation leads to better decision-making, clearer planning outcomes, and ultimately, better buildings and cities.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To be a trusted partner in architectural visualisation — combining quality, innovation and client service to deliver one complete, focused vision: helping every project be understood with clarity before construction begins, enabling confident decision-making and clearer planning outcomes.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">Our Core Values</h2>
              <p className="text-muted-foreground text-lg">
                These principles guide every decision we make and every project we undertake.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border text-center"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        

        {/* Company Stats */}
        <section className="section-padding bg-muted">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Projects Completed", value: "200+" },
                { label: "Approvals Achieved", value: "98%" },
                { label: "Years Experience", value: "5+" },
                { label: "Team Members", value: "50+" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
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
                Let's create something amazing together
              </h2>
              <p className="text-hero-muted text-lg mb-8 leading-relaxed">
                Ready to translate your project vision into accurate, engaging visual material?
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

export default About;
