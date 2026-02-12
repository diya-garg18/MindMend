import { 
  Brain, 
  MessageCircle, 
  BarChart3, 
  Lightbulb, 
  BookOpen, 
  Phone, 
  LogOut,
  Home,
  Menu,
  User,
  FileText
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Chat', url: '/chat', icon: MessageCircle },
  { title: 'Mood Tracking', url: '/mood', icon: BarChart3 },
];

const wellnessItems = [
  { title: 'Self-Help Tools', url: '/self-help', icon: Lightbulb },
  { title: 'Journal', url: '/journal', icon: FileText },
  { title: 'Resources', url: '/resources', icon: BookOpen },
];

const supportItems = [
  { title: 'Crisis Resources', url: '/crisis', icon: Phone },
];

export function AppSidebar() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className={cn("p-4", collapsed && "p-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className={cn(
            "rounded-xl gradient-calm flex items-center justify-center shadow-md shrink-0",
            collapsed ? "w-8 h-8" : "w-10 h-10"
          )}>
            <Brain className={cn("text-primary-foreground shrink-0", collapsed ? "w-4 h-4" : "w-5 h-5")} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-display font-bold text-lg text-sidebar-foreground">MindMend</h1>
              <p className="text-xs text-muted-foreground truncate">Wellness Companion</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn("px-2", collapsed && "px-1")}>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        collapsed ? "justify-center p-2.5 min-h-[44px]" : "gap-3 px-3 py-2.5",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3">
              Wellness Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {wellnessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        collapsed ? "justify-center p-2.5 min-h-[44px]" : "gap-3 px-3 py-2.5",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        collapsed ? "justify-center p-2.5 min-h-[44px]" : "gap-3 px-3 py-2.5",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className={cn("p-4 border-t border-sidebar-border", collapsed && "p-2")}>
        <NavLink
          to="/profile"
          className={cn(
            "flex items-center rounded-lg mb-2 transition-colors",
            collapsed ? "justify-center p-2.5 min-h-[44px]" : "gap-3 px-3 py-2.5",
            isActive('/profile')
              ? "bg-sidebar-accent text-sidebar-primary font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <User className="w-5 h-5 shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} />
          {!collapsed && <span>Profile</span>}
        </NavLink>
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive min-h-[44px]",
            collapsed ? "justify-center p-2.5" : "justify-start gap-3 px-3"
          )}
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppHeader() {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <SidebarTrigger className="mr-4">
        <Menu className="w-5 h-5" />
      </SidebarTrigger>
      <ThemeToggle />
    </header>
  );
}