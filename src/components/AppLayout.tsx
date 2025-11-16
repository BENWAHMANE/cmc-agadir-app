import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import edupathLogo from "@/assets/edupath-logo.png";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card shadow-soft px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <img src={edupathLogo} alt="EduPath Logo" className="h-10 w-auto object-contain" />
              <span className="font-bold text-lg text-primary">EduPath</span>
            </div>
            <div className="flex-1" />
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleLogout} title={t("logout")}>
              <LogOut className="h-4 w-4" />
            </Button>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
