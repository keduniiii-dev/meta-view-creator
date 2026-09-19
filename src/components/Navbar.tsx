import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
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
    <Collapsible open={open} onOpenChange={setOpen} asChild><nav className="fixed top-0 left-0 right-0 z-50 bg-hero/95 backdrop-blur-md border-b border-hero-muted/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="text-hero-foreground font-heading font-extrabold text-xl md:text-2xl tracking-tight">
          Twin<span className="text-gradient">blueprint</span>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-8">
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
        <Button variant="ghost"
          className="xl:hidden text-hero-foreground inline-flex items-center justify-center min-h-11 min-w-11 rounded-md"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <CollapsibleContent>
        <div id="mobile-nav" className="xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto bg-hero border-t border-hero-muted/10 pb-6">
          <div className="container flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-hero-muted hover:text-hero-foreground transition-colors text-sm font-medium flex min-h-11 items-center"
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
      </CollapsibleContent>
    </nav></Collapsible>
  );
};

export default Navbar;