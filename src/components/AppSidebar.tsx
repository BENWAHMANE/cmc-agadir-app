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

const menuItems = [
  { title: "الرئيسية", url: "/", icon: Home },
  { title: "الدورات", url: "/courses", icon: BookOpen },
  { title: "المنتديات", url: "/forums", icon: MessageSquare },
  { title: "المكتبة", url: "/library", icon: Library },
  { title: "الإعلانات", url: "/announcements", icon: Megaphone },
  { title: "الإشعارات", url: "/notifications", icon: Bell },
  { title: "النتائج", url: "/results", icon: TrendingUp },
  { title: "الرسائل", url: "/messaging", icon: FileText },
  { title: "العافية", url: "/wellness", icon: HeartPulse },
  { title: "تتبع العمل", url: "/work-tracking", icon: Briefcase },
  { title: "الاقتراحات", url: "/suggestions", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
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
