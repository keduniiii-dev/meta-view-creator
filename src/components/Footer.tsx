import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-hero border-t border-hero-muted/10 py-12">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="text-hero-foreground font-heading font-extrabold text-xl">
              Twin<span className="text-gradient">blueprint</span>
            </Link>
            <p className="text-hero-muted text-sm mt-3 leading-relaxed">
              Global leaders in metaverse property experiences for developers, architects, and urban planners.
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
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-hero-foreground font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-hero-muted text-sm hover:text-hero-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-hero-muted/10 text-center">
          <p className="text-hero-muted text-sm">© 2026 Twinblueprint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;