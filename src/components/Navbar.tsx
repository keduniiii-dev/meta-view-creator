import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/contexts/DemoDialogContext";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { setOpen: openDemo } = useDemoDialog();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/95 backdrop-blur-md border-b border-hero-muted/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <a href="/" className="text-hero-foreground font-heading font-extrabold text-xl md:text-2xl tracking-tight">
          Meta<span className="text-gradient">-Verse</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-hero-muted hover:text-hero-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6" onClick={() => openDemo(true)}>
            Book a Demo
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-hero-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-hero border-t border-hero-muted/10 pb-6">
          <div className="container flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-hero-muted hover:text-hero-foreground transition-colors text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-fit px-6" onClick={() => openDemo(true)}>
              Book a Demo
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
