import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { isCrmHost, mainSiteOrigin } from "@/lib/crm-base";

const NotFound = () => {
  const location = useLocation();
  const onCrmHost = isCrmHost();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const homeHref = onCrmHost ? mainSiteOrigin() : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href={homeHref} className="text-primary underline hover:text-primary/90">
          {onCrmHost ? "Return to the main site" : "Return to Home"}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
