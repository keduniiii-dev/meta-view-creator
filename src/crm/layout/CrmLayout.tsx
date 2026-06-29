import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, GitBranch, UserPlus, Send, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/crm/dashboard", icon: LayoutDashboard },
  { title: "Pipeline", url: "/crm/pipeline", icon: GitBranch },
  { title: "Capture", url: "/crm/capture", icon: UserPlus },
  { title: "Outreach", url: "/crm/outreach", icon: Send },
  { title: "Analytics", url: "/crm/analytics", icon: BarChart3 },
];

function CrmSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-14 border-b border-border" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const CrmLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CrmSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 sticky top-0 bg-background/90 backdrop-blur z-40">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold text-foreground">Twinblueprint CRM</h1>
            <span className="ml-auto text-xs text-muted-foreground">Internal · Not indexed</span>
          </header>
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CrmLayout;
