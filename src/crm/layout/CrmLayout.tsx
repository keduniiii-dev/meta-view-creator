import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import CrmFooter from "@/crm/components/CrmFooter";

const items = [
  { title: "Home", url: "/crm" },
  { title: "Dashboard", url: "/crm/dashboard" },
  { title: "Leads", url: "/crm/leads" },
  { title: "Pipeline", url: "/crm/pipeline" },
  { title: "Outreach", url: "/crm/outreach" },
  { title: "EMEA", url: "/crm/emea" },
  { title: "Americas", url: "/crm/americas" },
  { title: "Analytics", url: "/crm/analytics" },
];

const CrmLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/crm/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
          <NavLink to="/crm" className="flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"><Zap className="h-3.5 w-3.5" fill="currentColor" /></span>
            Twinblueprint
          </NavLink>
          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="CRM navigation">
            {items.map((item) => item.url ? (
              <NavLink key={item.url} end={item.url === "/crm"} to={item.url} className={({ isActive }) => `rounded-md px-3 py-2 text-xs transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{item.title}</NavLink>
            ) : <span key={item.title} className="rounded-md px-3 py-2 text-xs text-muted-foreground">{item.title}</span>)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="hidden h-11 text-xs sm:h-8 sm:inline-flex" onClick={() => navigate("/crm/capture")}>Get Started</Button>
            <Tooltip><TooltipTrigger asChild><Button variant="destructive" size="icon" className="h-11 w-11 shrink-0 sm:h-8 sm:w-8" onClick={() => setShowLogout(true)} aria-label="Log out"><LogOut className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Log out</TooltipContent></Tooltip>
            <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
              <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Log out?</AlertDialogTitle><AlertDialogDescription>You will be signed out of the CRM and returned to the login page.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel onClick={() => setShowLogout(false)}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleLogout}>Log out</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="icon" className="h-11 w-11 shrink-0 sm:h-8 sm:w-8 xl:hidden" aria-label="Open menu"><Menu className="h-4 w-4" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">CRM navigation</SheetTitle>
                <nav className="flex flex-col gap-1 p-4" aria-label="CRM navigation">
                  {items.map((item) => item.url ? (
                    <SheetClose asChild key={item.url}>
                      <NavLink end={item.url === "/crm"} to={item.url} className={({ isActive }) => `flex min-h-11 items-center rounded-md px-3 py-2 text-sm transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{item.title}</NavLink>
                    </SheetClose>
                  ) : <span key={item.title} className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm text-muted-foreground">{item.title}</span>)}
                  <div className="mt-2 border-t border-border pt-2">
                    <Button variant="outline" className="flex min-h-11 w-full items-center justify-center text-sm" onClick={() => navigate("/crm/capture")}>Get Started</Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="crm-content min-h-[calc(100dvh-7rem)] w-full min-w-0"><Outlet /></main>
      <CrmFooter />
    </div>
  );
};

export default CrmLayout;
