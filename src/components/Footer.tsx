import { Link } from "react-router-dom";
import { ShieldCheck, Award, Leaf, Lock } from "lucide-react";

const accreditations = [
  { icon: ShieldCheck, label: "ISO 27001 aligned" },
  { icon: Award, label: "RIBA-ready workflow" },
  { icon: Leaf, label: "BREEAM-aware visuals" },
  { icon: Lock, label: "GDPR compliant" },
];


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
        <div className="mt-10 pt-8 border-t border-hero-muted/10">
          <ul
            aria-label="Accreditations and standards"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mb-6"
          >
            {accreditations.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-hero-muted/15 bg-background/30 px-3 py-1.5 text-xs text-hero-muted"
              >
                <Icon className="h-3.5 w-3.5 text-primary/80" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <p className="text-hero-muted text-sm text-center">© 2026 Twinblueprint. Digital Twin and architectural visualisation specialists. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
