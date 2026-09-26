import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { crmOrigin } from "@/lib/crm-base";

const CrmHostRedirect = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const rest = pathname.replace(/^\/crm/, "") || "/";
    window.location.replace(`${crmOrigin()}${rest}${search}${hash}`);
  }, [pathname, search, hash]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <p className="text-muted-foreground">Redirecting to the CRM&hellip;</p>
    </div>
  );
};

export default CrmHostRedirect;
