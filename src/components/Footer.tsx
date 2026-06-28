import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-hero border-t border-hero-muted/10 py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-hero-foreground font-heading font-extrabold text-xl">
              Twin<span className="text-gradient">blueprint</span>
            </Link>
            <p className="text-hero-muted text-sm mt-3 leading-relaxed">
              Digital Twin specialists delivering architectural visualisation, infrastructure visualisation and interactive immersive property solutions for construction, planning and government clients.
            </p>
          </div>
          <div>
            <h4 className="text-hero-foreground font-semibold text-sm mb-4">Capabilities</h4>
            <ul className="space-y-2 text-hero-muted text-sm">
              <li><Link to="/services" className="hover:text-hero-foreground transition-colors">Digital Twin Solutions</Link></li>
              <li><Link to="/services" className="hover:text-hero-foreground transition-colors">Architectural Visualisation</Link></li>
              <li><Link to="/services" className="hover:text-hero-foreground transition-colors">Infrastructure Visualisation</Link></li>
              <li><Link to="/services" className="hover:text-hero-foreground transition-colors">Planning Approval Support</Link></li>
              <li><Link to="/services" className="hover:text-hero-foreground transition-colors">Immersive Property Visualisation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-hero-foreground font-semibold text-sm mb-4">Explore</h4>
            <ul className="space-y-2 text-hero-muted text-sm">
              <li><Link to="/case-studies" className="hover:text-hero-foreground transition-colors">Case Studies</Link></li>
              <li><Link to="/how-it-works" className="hover:text-hero-foreground transition-colors">How It Works</Link></li>
              <li><Link to="/#industries" className="hover:text-hero-foreground transition-colors">Industries We Support</Link></li>
              <li><Link to="/blog" className="hover:text-hero-foreground transition-colors">Blog & Insights</Link></li>
              <li><Link to="/about" className="hover:text-hero-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-hero-foreground font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-hero-muted text-sm">
              <li><Link to="/#contact" className="hover:text-hero-foreground transition-colors">Contact / Book a Demo</Link></li>
              <li><Link to="/faq" className="hover:text-hero-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-hero-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-hero-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-hero-muted/10 text-center">
          <p className="text-hero-muted text-sm">© 2026 Twinblueprint. Digital Twin and architectural visualisation specialists. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
