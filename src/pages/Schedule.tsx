import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Loader2, Home, Heart, Plane, Monitor, Factory, Palette, Fish, Hammer, Wheat, Settings, ShoppingCart, Building2, ChevronDown, Calendar } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import edupathLogo from "@/assets/edupath-logo.png";

interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  schedules: ScheduleItem[];
}

const categories: Category[] = [
  {
    id: "sante",
    title: "Santé",
    description: "Emplois du temps des formations en santé et soins médicaux",
    icon: Heart,
    schedules: []
  },
  {
    id: "tourisme",
    title: "Tourisme",
    description: "Emplois du temps des formations en hôtellerie et tourisme",
    icon: Plane,
    schedules: []
  },
  {
    id: "digital",
    title: "Digital",
    description: "Emplois du temps des formations en technologies numériques",
    icon: Monitor,
    schedules: []
  },
  {
    id: "agro-industrie",
    title: "Agro-industrie",
    description: "Emplois du temps des formations en transformation agroalimentaire",
    icon: Factory,
    schedules: []
  },
  {
    id: "art-graphique",
    title: "Art et industries graphiques",
    description: "Emplois du temps des formations en arts graphiques et design",
    icon: Palette,
    schedules: []
  },
  {
    id: "peche",
    title: "Pêche",
    description: "Emplois du temps des formations en pêche et aquaculture",
    icon: Fish,
    schedules: []
  },
  {
    id: "artisanat",
    title: "Artisanat",
    description: "Emplois du temps des formations en métiers artisanaux",
    icon: Hammer,
    schedules: []
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Emplois du temps des formations en agriculture et élevage",
    icon: Wheat,
    schedules: []
  },
  {
    id: "industrie",
    title: "Industrie",
    description: "Emplois du temps des formations en maintenance et production industrielle",
    icon: Settings,
    schedules: []
  },
  {
    id: "gestion-commerce",
    title: "Gestion et commerce",
    description: "Emplois du temps des formations en gestion et commerce",
    icon: ShoppingCart,
    schedules: []
  },
  {
    id: "btp",
    title: "BTP",
    description: "Emplois du temps des formations en bâtiment et travaux publics",
    icon: Building2,
    schedules: []
  }
];

const Schedule = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={edupathLogo} alt="EduPath Logo" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate("/")} className="h-9 w-9">
                <Home className="h-4 w-4" />
              </Button>
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="outline" size="icon" onClick={handleLogout} className="h-9 w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Emploi du Temps</h1>
            <p className="text-muted-foreground">Consultez les emplois du temps par pôle de formation</p>
          </div>

          <div className="space-y-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isOpen = openCategories.includes(category.id);
              
              return (
                <Card key={category.id} className="overflow-hidden shadow-card">
                  <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t p-4">
                        {category.schedules.length > 0 ? (
                          <div className="space-y-3">
                            {category.schedules.map((schedule) => (
                              <div key={schedule.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="font-medium text-foreground">{schedule.title}</p>
                                    <p className="text-sm text-muted-foreground">{schedule.description}</p>
                                  </div>
                                </div>
                                {schedule.pdfUrl && (
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => window.open(schedule.pdfUrl, '_blank')}>
                                      Consulter
                                    </Button>
                                    <Button size="sm" variant="default" asChild>
                                      <a href={schedule.pdfUrl} download>Télécharger</a>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            Aucun emploi du temps disponible pour le moment
                          </p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;