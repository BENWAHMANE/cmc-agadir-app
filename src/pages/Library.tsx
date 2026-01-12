import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, GraduationCap, Heart, Users, Monitor, Languages, BookOpen, Eye, Download, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

interface Book {
  id: string;
  title: string;
  author: string;
  pdfUrl: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  books: Book[];
}

const categories: Category[] = [
  {
    id: "psychology",
    title: "Psychologie & Développement Personnel",
    icon: <Brain className="h-6 w-6" />,
    description: "Livres sur la psychologie, la motivation et le développement de soi",
    books: [
      {
        id: "7-habitudes",
        title: "Les 7 habitudes des gens très efficaces",
        author: "Stephen R. Covey",
        pdfUrl: "/documents/library/psychology/Les_7_habitudes_des_gens_tres_efficaces.pdf",
      },
      {
        id: "pouvoir-illimite",
        title: "Pouvoir illimité",
        author: "Anthony Robbins",
        pdfUrl: "/documents/library/psychology/Pouvoir_illimite_Anthony_Robbins.pdf",
      },
      {
        id: "comment-se-faire-des-amis",
        title: "Comment se faire des amis",
        author: "Dale Carnegie",
        pdfUrl: "/documents/library/psychology/Comment_se_faire_des_amis.pdf",
      },
    ],
  },
  {
    id: "academic",
    title: "Réussite Scolaire & Méthodes d'Étude",
    icon: <GraduationCap className="h-6 w-6" />,
    description: "Guides et techniques pour améliorer vos performances académiques",
    books: [
      {
        id: "milaman-dorothee-camara",
        title: "Milaman Dorothée Camara",
        author: "Document académique",
        pdfUrl: "/documents/library/academic/17-Milaman-Dorothee-Camara.pdf",
      },
    ],
  },
  {
    id: "mental-health",
    title: "Santé Mentale & Bien-être",
    icon: <Heart className="h-6 w-6" />,
    description: "Ressources pour le bien-être mental et émotionnel",
    books: [],
  },
  {
    id: "education",
    title: "Éducation & Citoyenneté",
    icon: <Users className="h-6 w-6" />,
    description: "Ouvrages sur l'éducation civique et la citoyenneté",
    books: [],
  },
  {
    id: "digital",
    title: "Compétences Numériques & Technologie",
    icon: <Monitor className="h-6 w-6" />,
    description: "Livres sur l'informatique et les technologies numériques",
    books: [],
  },
  {
    id: "languages",
    title: "Langues & Communication",
    icon: <Languages className="h-6 w-6" />,
    description: "Ressources pour l'apprentissage des langues et la communication",
    books: [],
  },
];

const Library = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("psychology");
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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Bibliothèque Numérique</h1>
          </div>
          <p className="text-muted-foreground">Explorez nos ressources éducatives par catégorie</p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base leading-tight">{category.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {category.books.length} {category.books.length === 1 ? "livre" : "livres"}
                    </span>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedCategory === category.id && (
                <CardContent className="pt-0">
                  {category.books.length > 0 ? (
                    <div className="space-y-3">
                      {category.books.map((book) => (
                        <div 
                          key={book.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{book.title}</p>
                              <p className="text-xs text-muted-foreground">{book.author}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(book.pdfUrl, "_blank")}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Consulter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={book.pdfUrl} download>
                                <Download className="h-4 w-4 mr-1" />
                                Télécharger
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      📚 Aucun livre disponible pour le moment
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Library;
