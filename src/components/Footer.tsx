import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaFacebook, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-hero border-t border-hero-muted/10 py-12">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="text-hero-foreground font-heading font-extrabold text-xl">
              Meta<span className="text-gradient">-Verse</span>
            </Link>
            <p className="text-hero-muted text-sm mt-3 leading-relaxed">
              Global leaders in 3D property experiences for developers, architects, and urban planners.
            </p>
          </div>
          {[
            {
              title: "Resources",
              links: [
                { label: "FAQ", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms", href: "/terms" },
              ],
            },
            {
              title: "Contact",
              links: [
                { icon: FaInstagram, href: "https://instagram.com" },
                { icon: FaLinkedin, href: "https://linkedin.com" },
                { icon: FaWhatsapp, href: "https://whatsapp.com" },
                { icon: FaEnvelope, href: "mailto:hello@meta-dology.com" },
                { icon: FaFacebook, href: "https://facebook.com" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-hero-foreground font-semibold text-sm mb-4">{col.title}</h4>
              {col.title === "Contact" ? (
                <div className="flex gap-4">
                  {col.links.map((link: any) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-hero-muted hover:text-hero-foreground transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-hero-muted text-sm hover:text-hero-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-hero-muted/10 text-center">
          <p className="text-hero-muted text-sm">© 2026 Meta-dology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;