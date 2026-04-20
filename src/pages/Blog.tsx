import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoDialog } from "@/contexts/DemoDialogContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "How 3D Visualization is Transforming Planning Approvals",
    excerpt: "Discover why planning authorities are embracing photorealistic 3D renders as the new standard for development applications.",
    category: "Industry Trends",
    author: "Sarah Mitchell",
    date: "March 15, 2026",
    readTime: "8 min read",
    image: "url-placeholder",
  },
  {
    id: 2,
    title: "The ROI of Early Visualization: A Developer's Guide",
    excerpt: "Learn how investing in 3D visualization early in the project lifecycle can save months and millions in approval delays.",
    category: "Business Strategy",
    author: "James Chen",
    date: "March 8, 2026",
    readTime: "6 min read",
    image: "url-placeholder",
  },
  {
    id: 3,
    title: "Stakeholder Communication: From Drawings to Digital Experiences",
    excerpt: "Explore how interactive 3D models bridge the communication gap between architects, planners, and community stakeholders.",
    category: "Communication",
    author: "Emma Rodriguez",
    date: "February 28, 2026",
    readTime: "7 min read",
    image: "url-placeholder",
  },
  {
    id: 4,
    title: "The Future of Architectural Visualization",
    excerpt: "A deep dive into emerging technologies like AI-powered rendering and real-time collaboration in 3D visualization.",
    category: "Technology",
    author: "David Park",
    date: "February 20, 2026",
    readTime: "10 min read",
    image: "url-placeholder",
  },
  {
    id: 5,
    title: "Environmental Impact Visualization: Making Sustainability Visible",
    excerpt: "How 3D visualization helps communicate environmental considerations and sustainability features to all stakeholders.",
    category: "Sustainability",
    author: "Lisa Thompson",
    date: "February 12, 2026",
    readTime: "9 min read",
    image: "url-placeholder",
  },
  {
    id: 6,
    title: "Case Study: Virtual Site Walkthroughs During the Planning Process",
    excerpt: "An in-depth look at how virtual walkthroughs have revolutionized the way planners review and evaluate proposals.",
    category: "Case Studies",
    author: "Michael Brown",
    date: "February 5, 2026",
    readTime: "5 min read",
    image: "url-placeholder",
  },
];

const categories = ["All", "Industry Trends", "Business Strategy", "Communication", "Technology", "Sustainability", "Case Studies"];

const Blog = () => {
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
                Our <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Insights, trends, and best practices in 3D architectural visualization and the future of development approvals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="section-padding bg-background">
          <div className="container">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={cat === "All" ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                >
                  {cat}
                </Badge>
              ))}
            </motion.div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-muted group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  <div className="p-6">
                    <Badge className="mb-3 bg-primary/10 text-primary border-0 text-xs">
                      {post.category}
                    </Badge>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author} • {post.readTime}
                      </div>
                    </div>

                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary hover:text-primary/80"
                    >
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.article>
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
                Stay updated on the latest in visualization
              </h2>
              <p className="text-hero-muted text-lg mb-8 leading-relaxed">
                Subscribe to our newsletter for insights and trends in architectural visualization.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base"
                onClick={() => setOpen(true)}
              >
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
