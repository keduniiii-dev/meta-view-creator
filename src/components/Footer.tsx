const Footer = () => (
  <footer className="bg-hero border-t border-hero-muted/10 py-12">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <a href="/" className="text-hero-foreground font-heading font-extrabold text-xl">
            Meta<span className="text-gradient">-Verse</span>
          </a>
          <p className="text-hero-muted text-sm mt-3 leading-relaxed">
            Global leaders in 3D property experiences for developers, architects, and urban planners.
          </p>
        </div>
        {[
          {
            title: "Company",
            links: [
              { label: "Services", href: "/services" },
              { label: "Case Studies", href: "/case-studies" },
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "How It Works", href: "/how-it-works" },
              { label: "FAQ", href: "/faq" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms", href: "/terms" },
            ],
          },
          {
            title: "Contact",
            links: [
              { label: "Book a Demo", href: "#" },
              { label: "hello@meta-dology.com", href: "mailto:hello@meta-dology.com" },
              { label: "LinkedIn", href: "#" },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-hero-foreground font-semibold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-hero-muted text-sm hover:text-hero-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-hero-muted/10 text-center">
        <p className="text-hero-muted text-sm">© 2026 Meta-dology. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
