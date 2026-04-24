import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { setOpen: openDemo } = useDemoDialogStore();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/95 backdrop-blur-md border-b border-hero-muted/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="text-hero-foreground font-heading font-extrabold text-xl md:text-2xl tracking-tight">
          Meta<span className="text-gradient">-Verse</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-hero-muted hover:text-hero-foreground"
              }`}
            >
              {link.label}
            </Link>
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
              <Link
                key={link.label}
                to={link.href}
                className="text-hero-muted hover:text-hero-foreground transition-colors text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
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