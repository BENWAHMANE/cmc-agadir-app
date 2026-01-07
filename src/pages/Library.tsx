import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Brain, GraduationCap, Heart, Users, Monitor, Languages, BookOpen } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  bookCount: number;
}

const categories: Category[] = [
  {
    id: "psychology",
    title: "Psychologie & Développement Personnel",
    icon: <Brain className="h-6 w-6" />,
    description: "Livres sur la psychologie, la motivation et le développement de soi",
    bookCount: 0,
  },
  {
    id: "academic",
    title: "Réussite Scolaire & Méthodes d'Étude",
    icon: <GraduationCap className="h-6 w-6" />,
    description: "Guides et techniques pour améliorer vos performances académiques",
    bookCount: 0,
  },
  {
    id: "mental-health",
    title: "Santé Mentale & Bien-être",
    icon: <Heart className="h-6 w-6" />,
    description: "Ressources pour le bien-être mental et émotionnel",
    bookCount: 0,
  },
  {
    id: "education",
    title: "Éducation & Citoyenneté",
    icon: <Users className="h-6 w-6" />,
    description: "Ouvrages sur l'éducation civique et la citoyenneté",
    bookCount: 0,
  },
  {
    id: "digital",
    title: "Compétences Numériques & Technologie",
    icon: <Monitor className="h-6 w-6" />,
    description: "Livres sur l'informatique et les technologies numériques",
    bookCount: 0,
  },
  {
    id: "languages",
    title: "Langues & Communication",
    icon: <Languages className="h-6 w-6" />,
    description: "Ressources pour l'apprentissage des langues et la communication",
    bookCount: 0,
  },
];

const Library = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {category.icon}
                  </div>
                  <CardTitle className="text-base leading-tight">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <p className="text-xs text-muted-foreground">
                  {category.bookCount} {category.bookCount === 1 ? "livre" : "livres"} disponible{category.bookCount !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-muted/50">
          <p className="text-center text-muted-foreground text-sm">
            📚 Les livres seront bientôt disponibles. Restez à l'écoute !
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Library;
