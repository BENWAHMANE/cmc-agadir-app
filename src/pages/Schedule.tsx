import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Loader2, Home, Heart, Plane, Monitor, Factory, Palette, Fish, Hammer, Wheat, Settings, ShoppingCart, Building2, ChevronDown, Calendar, FileText, Download } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import edupathLogo from "@/assets/edupath-logo.png";

interface ScheduleFile {
  id: string;
  name: string;
  url: string;
}

interface Filiere {
  id: string;
  name: string;
  schedules?: ScheduleFile[];
}

interface Pole {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  filieres: Filiere[];
}

const poles: Pole[] = [
  {
    id: "tourisme",
    title: "Tourisme",
    description: "Formations en hôtellerie et tourisme",
    icon: Plane,
    filieres: [
      { 
        id: "mh", 
        name: "Management Hôtellerie (MH)",
        schedules: [
          { id: "mh-general", name: "Emploi du temps MH", url: "/documents/schedules/MH.pdf" },
          { id: "mh-101", name: "Emploi du temps MH101", url: "/documents/schedules/MH101.pdf" },
          { id: "mh-103", name: "Emploi du temps MH103", url: "/documents/schedules/MH103.pdf" }
        ]
      },
      { 
        id: "mt", 
        name: "Management Touristique (MT)",
        schedules: [
          { id: "mt-101", name: "Emploi du temps MT101", url: "/documents/schedules/MT101.pdf" },
          { id: "mt-102", name: "Emploi du temps MT102", url: "/documents/schedules/MT102.pdf" }
        ]
      },
      { 
        id: "arts-culinaires", 
        name: "Arts culinaires",
        schedules: [
          { id: "ac-101", name: "Emploi du temps AC101", url: "/documents/schedules/AC101.pdf" },
          { id: "ac-102", name: "Emploi du temps AC102", url: "/documents/schedules/AC102.pdf" }
        ]
      },
      { 
        id: "art-table", 
        name: "Art de la table (SRAT)",
        schedules: [
          { id: "srat-101", name: "Emploi du temps SRAT101", url: "/documents/schedules/SRAT101.pdf" },
          { id: "srat-102", name: "Emploi du temps SRAT102", url: "/documents/schedules/SRAT102.pdf" }
        ]
      }
    ]
  },
  {
    id: "sante",
    title: "Santé",
    description: "Formations en santé et soins médicaux",
    icon: Heart,
    filieres: [
      { id: "biomed", name: "Installation et maintenance biomédicale" },
      { id: "radiologie", name: "Radiologie diagnostique" },
      { id: "analyses", name: "Analyses médicales" }
    ]
  },
  {
    id: "digital",
    title: "Digital",
    description: "Formations en technologies numériques",
    icon: Monitor,
    filieres: [
      { id: "infra-digital", name: "Infrastructure digitale" },
      { id: "dev-digital", name: "Développement digital" },
      { id: "design-digital", name: "Digital design" }
    ]
  },
  {
    id: "peche",
    title: "Pêche",
    description: "Formations en pêche et aquaculture",
    icon: Fish,
    filieres: [
      { id: "maintenance-navires", name: "Maintenance mécanique des navires de pêche" },
      { id: "aquaculture", name: "Aquaculture" },
      { id: "greeur", name: "Gréeur d'engins de pêche" }
    ]
  },
  {
    id: "artisanat",
    title: "Artisanat",
    description: "Formations en métiers artisanaux",
    icon: Hammer,
    filieres: [
      { id: "haute-couture", name: "Technicien spécialisé en haute couture" },
      { id: "bijouterie", name: "Technicien spécialisé en bijouterie-joaillerie" },
      { id: "maroquinerie", name: "Technicien spécialisé en maroquinerie" }
    ]
  },
  {
    id: "industrie",
    title: "Industrie",
    description: "Formations en maintenance et production industrielle",
    icon: Settings,
    filieres: [
      { id: "genie-meca", name: "Génie mécanique" },
      { id: "genie-elec", name: "Génie électrique" },
      { id: "energies-renouv", name: "Énergies renouvelables" }
    ]
  },
  {
    id: "btp",
    title: "BTP",
    description: "Formations en bâtiment et travaux publics",
    icon: Building2,
    filieres: [
      { id: "genie-civil", name: "Génie civil" },
      { id: "construction-metal", name: "Construction métallique" },
      { id: "electricite-bat", name: "Électricité du bâtiment" }
    ]
  },
  {
    id: "gestion",
    title: "Gestion",
    description: "Formations en gestion et commerce",
    icon: ShoppingCart,
    filieres: [
      { id: "gestion-entreprise", name: "Gestion d'entreprise" },
      { id: "compta-finance", name: "Comptabilité et finance" },
      { id: "commerce-marketing", name: "Commerce et marketing" }
    ]
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
            <p className="text-muted-foreground">Consultez les emplois du temps par filière et pôle de formation</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Filières</h2>
            <p className="text-sm text-muted-foreground">Organisées par pôles de formation</p>
          </div>

          <div className="space-y-4">
            {poles.map((pole) => {
              const IconComponent = pole.icon;
              const isOpen = openCategories.includes(pole.id);
              
              return (
                <Card key={pole.id} className="overflow-hidden shadow-card">
                  <Collapsible open={isOpen} onOpenChange={() => toggleCategory(pole.id)}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground">{pole.title}</h3>
                            <p className="text-sm text-muted-foreground">{pole.description}</p>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t p-4">
                        {pole.filieres.length > 0 ? (
                          <div className="space-y-3">
                            {pole.filieres.map((filiere) => (
                              <div key={filiere.id} className="p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3 mb-2">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <p className="font-medium text-foreground">{filiere.name}</p>
                                </div>
                                {filiere.schedules && filiere.schedules.length > 0 ? (
                                  <div className="ml-7 space-y-2">
                                    {filiere.schedules.map((schedule) => (
                                      <div key={schedule.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm text-foreground">{schedule.name}</span>
                                        </div>
                                        <a
                                          href={schedule.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                                        >
                                          <Download className="h-3 w-3" />
                                          Télécharger
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="ml-7 text-xs text-muted-foreground">Emploi du temps à venir</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            Aucune filière disponible pour le moment
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