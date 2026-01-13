import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, FileText, Download, ChevronDown, Heart, Plane, Monitor, Factory, Palette, Ship, Hammer, Leaf, Settings, Briefcase, Building } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

interface Course {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  courses: Course[];
}

const categories: Category[] = [
  {
    id: "tourisme",
    title: "Tourisme",
    description: "Formations en hôtellerie, restauration et tourisme",
    icon: <Plane className="h-6 w-6" />,
    courses: [
      {
        id: "1",
        title: "Hygiène et Sécurité dans le Milieu Hôtelier",
        description: "Exploiter l'information relative aux lois et règlements en matière d'hygiène et de sécurité - Module N°102",
        pdfUrl: "/documents/support_final_MH.pdf",
      },
      {
        id: "2",
        title: "Manuel Stagiaire - Module M01",
        description: "Manuel du stagiaire pour le module M01 en hôtellerie",
        pdfUrl: "/documents/courses/MH_M01_Manuel_Stagiaire.pdf",
      },
      {
        id: "3",
        title: "Manuel Stagiaire - Module M01 (Partie 2)",
        description: "Manuel du stagiaire pour le module M01 en hôtellerie - Partie 2",
        pdfUrl: "/documents/courses/MH_M01_Manuel_Stagiaire-2.pdf",
      },
      {
        id: "4",
        title: "Manuel Stagiaire - Module M01 (Partie 3)",
        description: "Manuel du stagiaire pour le module M01 en hôtellerie - Partie 3",
        pdfUrl: "/documents/courses/MH_M01_Manuel_Stagiaire-3.pdf",
      },
    ],
  },
  {
    id: "sante",
    title: "Santé",
    description: "Formations dans le domaine de la santé et du bien-être",
    icon: <Heart className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "digital",
    title: "Digital",
    description: "Formations en informatique et technologies numériques",
    icon: <Monitor className="h-6 w-6" />,
    courses: [
      {
        id: "d1",
        title: "Logiciels de modélisation graphique - TP",
        description: "Module M107 - Travaux pratiques sur les logiciels de modélisation graphique",
        pdfUrl: "/documents/courses/M107_Logiciels_de_modélisation_graphique_TP.pdf",
      },
    ],
  },
  {
    id: "agro-industrie",
    title: "Agro-industrie",
    description: "Formations en transformation agroalimentaire",
    icon: <Factory className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "art-graphique",
    title: "Art et industries graphiques",
    description: "Formations en arts visuels et design graphique",
    icon: <Palette className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "peche",
    title: "Pêche",
    description: "Formations en pêche et aquaculture",
    icon: <Ship className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "artisanat",
    title: "Artisanat",
    description: "Formations en métiers artisanaux traditionnels",
    icon: <Hammer className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Formations en agriculture et élevage",
    icon: <Leaf className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "industrie",
    title: "Industrie",
    description: "Formations en métiers industriels",
    icon: <Settings className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "gestion-commerce",
    title: "Gestion et commerce",
    description: "Formations en gestion d'entreprise et commerce",
    icon: <Briefcase className="h-6 w-6" />,
    courses: [],
  },
  {
    id: "btp",
    title: "BTP",
    description: "Formations en bâtiment et travaux publics",
    icon: <Building className="h-6 w-6" />,
    courses: [],
  },
];

const Courses = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>(["tourisme"]);
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
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Les Cours</h1>
          <p className="text-muted-foreground">Accédez aux supports de cours par pôle de formation</p>
        </div>

        <div className="grid gap-4">
          {categories.map((category) => (
            <Collapsible
              key={category.id}
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {category.courses.length} cours
                        </span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${openCategories.includes(category.id) ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {category.courses.length > 0 ? (
                      <div className="space-y-3">
                        {category.courses.map((course) => (
                          <div key={course.id} className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-medium">{course.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                                <div className="flex gap-2 mt-3">
                                  <Button asChild size="sm">
                                    <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Consulter
                                    </a>
                                  </Button>
                                  <Button asChild variant="outline" size="sm">
                                    <a href={course.pdfUrl} download>
                                      <Download className="h-4 w-4 mr-2" />
                                      Télécharger
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">
                        Aucun cours disponible pour le moment
                      </p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Courses;
