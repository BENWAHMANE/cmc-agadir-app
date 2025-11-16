import { Home, BookOpen, MessageSquare, FileText, Library, Bell, TrendingUp, HeartPulse, Briefcase, Settings, Megaphone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

const menuItems = [
  { key: "home", url: "/", icon: Home },
  { key: "courses", url: "/courses", icon: BookOpen },
  { key: "forums", url: "/forums", icon: MessageSquare },
  { key: "library", url: "/library", icon: Library },
  { key: "announcements", url: "/announcements", icon: Megaphone },
  { key: "notifications", url: "/notifications", icon: Bell },
  { key: "results", url: "/results", icon: TrendingUp },
  { key: "messaging", url: "/messaging", icon: FileText },
  { key: "wellness", url: "/wellness", icon: HeartPulse },
  { key: "workTracking", url: "/work-tracking", icon: Briefcase },
  { key: "suggestions", url: "/suggestions", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("mainMenu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {open && <span>{t(item.key)}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
