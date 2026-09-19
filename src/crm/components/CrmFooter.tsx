import { Zap } from "lucide-react";

const CrmFooter = () => (
  <footer className="border-t border-border bg-background px-5 py-6 sm:px-8">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground"><Zap className="h-3 w-3" fill="currentColor" /></span>
        Twinblueprint
      </div>
      <span>© 2026 Twinblueprint CRM. All rights reserved.</span>
    </div>
  </footer>
);

export default CrmFooter;
