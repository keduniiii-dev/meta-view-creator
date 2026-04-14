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
            links: ["Services", "Case Studies", "Blog", "About"],
          },
          {
            title: "Resources",
            links: ["How It Works", "FAQ", "Privacy Policy", "Terms"],
          },
          {
            title: "Contact",
            links: ["Book a Demo", "hello@meta-dology.com", "LinkedIn"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-hero-foreground font-semibold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-hero-muted text-sm hover:text-hero-foreground transition-colors">
                    {link}
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
