import { motion } from "framer-motion";
import { ArrowRight, Building2, Trophy, Train, Factory, TreePine, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BookDemoDialog from "@/components/BookDemoDialog";
import caseStudy1 from "@/assets/case-study-1.jpg";
import caseStudy2 from "@/assets/case-study-2.jpg";
import heroImage from "@/assets/case-studies-hero.jpg";

const specialties = [
  { icon: Building2, title: "Mega Projects", description: "Large-scale, multi-phase developments where digital twins drive alignment, planning and stakeholder buy-in." },
  { icon: Trophy, title: "Stadiums", description: "Immersive walkthroughs for sports and event venues - from fan experience to operational planning." },
  { icon: Train, title: "Transport Hubs", description: "Metro stations, terminals and interchanges visualised as living, data-rich digital twins." },
  { icon: Factory, title: "Industrial Parks", description: "Warehouse, logistics and tenant space planning with simulation-led optimisation." },
  { icon: TreePine, title: "Lifestyle Estates", description: "Golf, residential and resort estates brought to life for investors, buyers and overseas markets." },
  { icon: Landmark, title: "Government & Council", description: "Infrastructure and public sector projects accelerated through visual clarity and approvals." },
];

const successStories = [
  {
    title: "Harbour Road",
    sector: "Private",
    category: "Luxury Coastal Residential Development",
    size: "130 units",
    duration: "5 Years",
    status: "Pre-Development / Multi-Phase Rollout",
    description: "Harbour Road is a luxury coastal residential development in Kleinmond, South Africa, offering lock-up-and-go living shaped by nature, village ease and harbour-side energy. Meta-dology was brought in to translate the product and wider rejuvenation story into an immersive digital experience capturing lifestyle, setting and long-term vision.",
  },
  {
    title: "Metro Digital Twin",
    sector: "Public / Government",
    category: "Metro Infrastructure",
    size: "29 Subways",
    duration: "10 Years",
    status: "Ongoing",
    description: "An intelligent, fully explorable digital twin uniting an entire metro network into one cohesive, interactive experience - bringing every station, tunnel and surrounding point of interest to life for smarter planning, proactive maintenance and public engagement.",
  },
  {
    title: "Foster's Farm",
    sector: "Private",
    category: "Luxury Lifestyle Estate & Golf Course",
    size: "253 Residences, Hotel, 30 Bungalows & Retail",
    duration: "5 Years",
    status: "Ongoing",
    description: "A sprawling secluded luxury estate with a championship golf course, hotel bungalows and expansive residences. We delivered a hyperrealistic digital twin that secured mezzanine finance, government approvals and accelerated phase planning.",
  },
  {
    title: "Land of Nomads",
    sector: "Private",
    category: "Mixed Use & Investments Estate",
    size: "368 Villa Lofts across 5 phases",
    duration: "5 Years",
    status: "Ongoing",
    description: "A multi-country portfolio of six premium second-home developments in unique destinations. The platform serves every stage - funding, planning, sales, rentals and property management - for a global audience.",
  },
  {
    title: "Mount Royal",
    sector: "Private",
    category: "Lifestyle and Golf Estate",
    size: "600 Family Home Opportunities",
    duration: "3 Years",
    status: "Ongoing",
    description: "A gated lifestyle estate where buyers can virtually fly to their chosen plot, toggle through home layouts and instantly see how a property maximises views, space and lifestyle - accelerating the sales cycle across phases.",
  },
  {
    title: "AEHECA",
    sector: "Private",
    category: "Luxury Condominiums",
    size: "11 Boutique Apartments",
    duration: "1 Year",
    status: "Ongoing",
    description: "An exclusive boutique condominium development steps from golden beaches and a world-class marina. Buyers can walk through, see sunlight by time of day, toggle walls and furnishings, and explore the neighbourhood in a hyperreal 3D environment.",
  },
  {
    title: "Sunrise Marina",
    sector: "Private",
    category: "Luxury Mixed Use Development & Marina",
    size: "14 Residences, 8 Shops, 80-Berth Marina",
    duration: "4 Years",
    status: "Ongoing",
    description: "A world-class luxury marina destination. Real-world topographical data with current and wave simulations validated commercial feasibility, secured environmental approvals and aligned developers, investors and regulators.",
  },
  {
    title: "Noka Park",
    sector: "Private",
    category: "Industrial Warehouse Rentals",
    size: "4 Industrial Warehouses",
    duration: "1 Year",
    status: "Ongoing",
    description: "A modern industrial park delivered as a hyperrealistic 3D walkthrough in just 10 days - enabling tenant signage, truck-turning simulations, shelving layouts and office positioning all before move-in.",
  },
  {
    title: "Absa",
    sector: "Private",
    category: "Commercial / Residential Sales",
    size: "3 Office Buildings",
    duration: "2 Months",
    status: "Complete",
    description: "Helped Absa offload portfolio assets at above-market value by enabling investors to toggle between commercial and residential layouts instantly - unlocking versatility and maximum return.",
  },
  {
    title: "Discovery",
    sector: "Private",
    category: "Office Floor Rentals",
    size: "3 Premium Floors of 3,000m² each",
    duration: "2 Months",
    status: "Complete",
    description: "An urgent commercial rental delivered in 10 days. Prospective tenants toggled between open- and closed-plan layouts with embedded real-time rental metrics - accelerating leasing conversations and conversion.",
  },
  {
    title: "Fourways Gardens",
    sector: "Private",
    category: "Residential Renovation",
    size: "Private Residence",
    duration: "Project-based",
    status: "Complete",
    description: "A neglected private residence reimagined through a hyper-realistic 3D model, giving the homeowner, architect and contractor a single shared vision before a single brick was moved.",
  },
];

const caseStudies = [
  {
    id: 1,
    image: caseStudy1,
    category: "Residential",
    title: "Riverside Apartments - 40% Faster Approval",
    location: "London, UK",
    developer: "Thames Development Co.",
    challenge: "A developer struggled with multiple planning rejections for a 200-unit residential project. The local planning authority had concerns about the visual impact and integration with the surrounding Victorian buildings.",
    solution: "We created photorealistic interactive 3D walkthroughs showing the development in context with its surroundings. The visualization included seasonal variations and different times of day to demonstrate how the building would integrate with the neighborhood.",
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
    solution: "Interactive digital twin with flythrough animations presented at council meetings. Different stakeholder versions highlighted relevant considerations for transport, environment, and community groups.",
    result: "Unanimous stakeholder approval achieved in a single session - a first for the authority.",
    metrics: [
      { label: "Stakeholders", value: "12" },
      { label: "Approval Time", value: "1 session" },
      { label: "Success Rate", value: "100%" },
    ],
  },
];

const CaseStudies = () => {
  const { setOpen } = useDemoDialogStore();

  return (
    <>
      <SEO
        title="Case Studies | Digital Twin & Visualisation Projects | Twinblueprint"
        description="Real-world projects where digital twins and immersive property visualisation have accelerated approvals, secured investment and aligned stakeholders."
        path="/case-studies"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://meta-view-creator.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://meta-view-creator.lovable.app/case-studies" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Twinblueprint Case Studies",
            itemListElement: successStories.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              description: s.description,
            })),
          },
        ]}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-hero pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" aria-hidden="true" />
          <div className="container relative">
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
                Real projects, real results. See how our digital twins have transformed approval timelines and stakeholder communication across the world.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use Cases / Specialties */}
        <section className="section-padding bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Use Cases</p>
              <h2 className="text-3xl md:text-4xl text-foreground">Our areas of speciality at a glance</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialties.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-all hover:shadow-glow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-5">
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="section-padding bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Portfolio</p>
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">Some of our Success Stories</h2>
              <p className="text-muted-foreground text-lg">Highlights from our portfolio</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story, i) => (
                <motion.article
                  key={story.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.06 }}
                  className="group relative rounded-2xl bg-card border border-border p-7 hover:border-primary/50 transition-all hover:shadow-glow flex flex-col"
                >
                  <Badge className="self-start mb-4 bg-primary/10 text-primary border-0">
                    {story.sector}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground mb-2">{story.title}</h3>
                  <p className="text-sm text-primary mb-4">{story.category}</p>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-5 pb-5 border-b border-border">
                    <div>
                      <dt className="text-muted-foreground uppercase tracking-wider">Size</dt>
                      <dd className="text-foreground font-medium mt-1">{story.size}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground uppercase tracking-wider">Duration</dt>
                      <dd className="text-foreground font-medium mt-1">{story.duration}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground uppercase tracking-wider">Status</dt>
                      <dd className="text-foreground font-medium mt-1">{story.status}</dd>
                    </div>
                  </dl>

                  <p className="text-sm text-muted-foreground leading-relaxed">{story.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Case Studies (existing detailed ones) */}
        <section className="section-padding bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Featured</p>
              <h2 className="text-3xl md:text-4xl text-foreground">Featured Case Studies</h2>
            </motion.div>

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
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover"
                        width={800}
                        height={600}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <Badge className="mb-4 bg-primary/10 text-primary border-0">
                      {study.category}
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                      {study.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      📍 {study.location} • {study.developer}
                    </p>

                    <div className="space-y-6 mb-8">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Challenge</h3>
                        <p className="text-muted-foreground leading-relaxed">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Solution</h3>
                        <p className="text-muted-foreground leading-relaxed">{study.solution}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Result</h3>
                        <p className="text-primary font-semibold">{study.result}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-muted rounded-xl">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className="text-2xl font-bold text-primary">{metric.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                        onClick={() => setOpen(true)}
                      >
                        Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                        <Link to={`/case-studies/${study.id}`}>Learn More</Link>
                      </Button>
                    </div>
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
                Explore our <Link to="/services" className="text-primary underline-offset-4 hover:underline">architectural visualisation services</Link>, learn about <Link to="/how-it-works" className="text-primary underline-offset-4 hover:underline">our four-step delivery process</Link>, or read the latest from the <Link to="/blog" className="text-primary underline-offset-4 hover:underline">Twinblueprint blog</Link>.
              </p>
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground shadow-glow animate-pulse-glow rounded-full px-8 text-base"
                onClick={() => setOpen(true)}
              >
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
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

export default CaseStudies;
