import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoDialogStore } from "@/stores/demoDialogStore";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDemoDialog from "@/components/BookDemoDialog";

import { FaBuilding, FaChartLine, FaComments, FaRobot, FaLeaf, FaVrCardboard } from "react-icons/fa";

const blogPosts = [
  {
    id: 1,
    title: "How 3D Visualization is Transforming Planning Approvals",
    excerpt: "Discover why planning authorities are embracing photorealistic 3D renders as the new standard for development applications.",
    category: "Industry Trends",
    author: "Sarah Mitchell",
    date: "March 15, 2026",
    readTime: "8 min read",
    icon: FaBuilding,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: 2,
    title: "The ROI of Early Visualization: A Developer's Guide",
    excerpt: "Learn how investing in 3D visualization early in the project lifecycle can save months and millions in approval delays.",
    category: "Business Strategy",
    author: "James Chen",
    date: "March 8, 2026",
    readTime: "6 min read",
    icon: FaChartLine,
    gradient: "from-green-600 to-emerald-500",
  },
  {
    id: 3,
    title: "Stakeholder Communication: From Drawings to Digital Experiences",
    excerpt: "Explore how interactive 3D models bridge the communication gap between architects, planners, and community stakeholders.",
    category: "Communication",
    author: "Emma Rodriguez",
    date: "February 28, 2026",
    readTime: "7 min read",
    icon: FaComments,
    gradient: "from-purple-600 to-pink-500",
  },
  {
    id: 4,
    title: "The Future of Architectural Visualization",
    excerpt: "A deep dive into emerging technologies like AI-powered rendering and real-time collaboration in 3D visualization.",
    category: "Technology",
    author: "David Park",
    date: "February 20, 2026",
    readTime: "10 min read",
    icon: FaRobot,
    gradient: "from-orange-600 to-amber-500",
  },
  {
    id: 5,
    title: "Environmental Impact Visualization: Making Sustainability Visible",
    excerpt: "How 3D visualization helps communicate environmental considerations and sustainability features to all stakeholders.",
    category: "Sustainability",
    author: "Lisa Thompson",
    date: "February 12, 2026",
    readTime: "9 min read",
    icon: FaLeaf,
    gradient: "from-teal-600 to-green-500",
  },
  {
    id: 6,
    title: "Case Study: Virtual Site Walkthroughs During the Planning Process",
    excerpt: "An in-depth look at how virtual walkthroughs have revolutionized the way planners review and evaluate proposals.",
    category: "Case Studies",
    author: "Michael Brown",
    date: "February 5, 2026",
    readTime: "5 min read",
    icon: FaVrCardboard,
    gradient: "from-indigo-600 to-blue-500",
  },
  {
    id: 7,
    title: "Maximizing Marketing Impact with Hyper-Realistic Renders",
    excerpt: "Learn how high-quality 3D renders can transform your property marketing and accelerate sales.",
    category: "Marketing",
    author: "Anna Wilson",
    date: "January 28, 2026",
    readTime: "6 min read",
    icon: FaBuilding,
    gradient: "from-pink-600 to-rose-500",
  },
  {
    id: 8,
    title: "VR and AR: The New Frontier in Property Sales",
    excerpt: "How virtual and augmented reality are changing the way developers showcase off-plan properties.",
    category: "Technology",
    author: "Chris Lee",
    date: "January 20, 2026",
    readTime: "8 min read",
    icon: FaVrCardboard,
    gradient: "from-cyan-600 to-blue-500",
  },
  {
    id: 9,
    title: "Community Engagement: Winning Over Local Stakeholders",
    excerpt: "Best practices for presenting development proposals to community groups and gaining public support.",
    category: "Communication",
    author: "Rachel Green",
    date: "January 12, 2026",
    readTime: "7 min read",
    icon: FaComments,
    gradient: "from-violet-600 to-purple-500",
  },
];

const categories = ["All", "Industry Trends", "Business Strategy", "Communication", "Technology", "Sustainability", "Case Studies", "Marketing"];

const Blog = () => {
  const { setOpen } = useDemoDialogStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail) {
      setSubscribed(true);
      toast({ title: "Subscribed!", description: "You'll receive our latest updates." });
      setSubscribeEmail("");
    }
  };

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
                Our <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-hero-muted text-lg md:text-xl leading-relaxed">
                Insights, trends, and best practices in 3D architectural visualization and the future of development approvals.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer"
                >
                  <div className={`h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center overflow-hidden`}>
                    <post.icon className="w-16 h-16 text-white/80" />
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

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => navigate("/case-studies")}
                      >
                        View Case Studies
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setOpen(true)}
                      >
                        Request a Demo
                      </Button>
                    </div>
                  </div>
                </motion.article>
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
                Stay updated on the latest in visualization
              </h2>
              <p className="text-hero-muted text-lg mb-8 leading-relaxed">
                Subscribe to our newsletter for insights and trends in architectural visualization.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
                {subscribed ? (
                  <div className="flex items-center gap-2 text-green-400 justify-center">
                    <Check className="h-5 w-5" />
                    <span>Thanks for subscribing!</span>
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      required
                      className="flex-1 px-4 py-3 rounded-full bg-background/10 border border-hero-muted/20 text-hero-foreground placeholder:text-hero-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base">
                      Subscribe
                    </Button>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <BookDemoDialog />
    </>
  );
};

export default Blog;