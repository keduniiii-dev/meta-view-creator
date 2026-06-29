import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => (
  <nav
    aria-label="Breadcrumb"
    className={`text-sm text-hero-muted ${className}`}
  >
    <ol className="flex flex-wrap items-center gap-1.5">
      <li className="flex items-center gap-1.5">
        <Link
          to="/"
          className="inline-flex items-center gap-1 hover:text-hero-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Home</span>
        </Link>
      </li>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            {isLast || !item.href ? (
              <span
                aria-current={isLast ? "page" : undefined}
                className="text-hero-foreground/90 line-clamp-1 max-w-[60vw] sm:max-w-none"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-hero-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
