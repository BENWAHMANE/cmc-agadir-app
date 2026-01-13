import { Home, BookOpen, FileText, Library, Bell, Calendar, HeartPulse, Image, Settings, LayoutGrid, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "./ui/separator";

const menuItems = [
  { key: "home", url: "/", icon: Home },
  { key: "courses", url: "/courses", icon: BookOpen },
  { key: "library", url: "/library", icon: Library },
  { key: "announcements", url: "/announcements", icon: LayoutGrid },
  { key: "notifications", url: "/notifications", icon: Bell },
  { key: "schedule", url: "/schedule", icon: Calendar },
  { key: "messaging", url: "/messaging", icon: FileText },
  { key: "wellness", url: "/wellness", icon: HeartPulse },
  { key: "workTracking", url: "/work-tracking", icon: Image },
  { key: "suggestions", url: "/suggestions", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
      
      <SidebarFooter>
        <Separator className="mb-2" />
        <div className="flex items-center gap-2 p-2">
          {open ? (
            <>
              <LanguageSwitcher />
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout} 
                title={t("logout")}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 items-center w-full">
              <LanguageSwitcher />
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout} 
                title={t("logout")}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
