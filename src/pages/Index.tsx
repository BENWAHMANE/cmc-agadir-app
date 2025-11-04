import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TraineeForm } from "@/components/TraineeForm";
import { ContactInfo } from "@/components/ContactInfo";
import { InstitutionInfo } from "@/components/InstitutionInfo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Loader2, Save } from "lucide-react";
import edupathLogo from "@/assets/edupath-logo.png";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Hammer,
  Plane,
  Leaf,
  Monitor,
  Factory,
  Wheat,
  TrendingUp,
  Palette,
  Building,
  Fish,
} from "lucide-react";

const trainingFields = [
  { value: "sante", label: "Santé", icon: Heart },
  { value: "artisanat", label: "Artisanat", icon: Hammer },
  { value: "tourisme", label: "Tourisme", icon: Plane },
  { value: "agriculture", label: "Agriculture", icon: Leaf },
  { value: "digital", label: "Digital", icon: Monitor },
  { value: "industrie", label: "Industrie", icon: Factory },
  { value: "agro-industrie", label: "Agro-industrie", icon: Wheat },
  { value: "gestion-commerce", label: "Gestion et commerce", icon: TrendingUp },
  { value: "art-graphique", label: "Art et industrie graphique", icon: Palette },
  { value: "btp", label: "BTP", icon: Building },
  { value: "peche", label: "Pèche", icon: Fish },
];

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [traineeName, setTraineeName] = useState("");
  const [trainingField, setTrainingField] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          loadProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile(data);
      if (data) {
        setTraineeName(data.trainee_name);
        setTrainingField(data.training_field);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!traineeName.trim() || !trainingField) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        trainee_name: traineeName.trim(),
        training_field: trainingField,
      });

      if (error) throw error;

      toast.success("Profil enregistré avec succès !");
      loadProfile(user.id);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Redirect to auth if not logged in
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
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={edupathLogo} 
                alt="EduPath Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="outline" size="icon" onClick={handleLogout} className="h-9 w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Plateforme de Gestion des Formations
            </h2>
            <p className="text-muted-foreground">
              Bienvenue {profile?.trainee_name || user?.email}
            </p>
          </div>

          {/* Profile Form or Tabs */}
          {!profile ? (
            <Card className="p-6 shadow-card">
              <h3 className="mb-6 text-xl font-semibold text-foreground">
                Complétez votre profil
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="trainee-name" className="text-base font-medium">
                    Nom du stagiaire
                  </Label>
                  <Input
                    id="trainee-name"
                    placeholder="Entrez votre nom complet"
                    value={traineeName}
                    onChange={(e) => setTraineeName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="training-field" className="text-base font-medium">
                    Pôle de formation
                  </Label>
                  <Select value={trainingField} onValueChange={setTrainingField}>
                    <SelectTrigger id="training-field" className="h-11">
                      <SelectValue placeholder="Sélectionnez votre pôle" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {trainingFields.map((field) => {
                        const Icon = field.icon;
                        return (
                          <SelectItem key={field.value} value={field.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" />
                              <span>{field.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full h-11"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Navigation Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/results")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Les Résultats</h3>
                  <p className="text-sm text-muted-foreground">Consultez vos résultats</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/library")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Bibliothèque Numérique</h3>
                  <p className="text-sm text-muted-foreground">Ressources éducatives</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/announcements")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Annonces et Événements</h3>
                  <p className="text-sm text-muted-foreground">Dernières nouvelles</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/suggestions")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Boîte à Suggestions</h3>
                  <p className="text-sm text-muted-foreground">Partagez vos idées</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/notifications")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Alertes et Notifications</h3>
                  <p className="text-sm text-muted-foreground">Gérez vos notifications</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Espace Administratif</h3>
                  <p className="text-sm text-muted-foreground">Gestion administrative</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/messaging")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Messagerie Interne</h3>
                  <p className="text-sm text-muted-foreground">Communiquez</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/work-tracking")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Suivi des Travaux</h3>
                  <p className="text-sm text-muted-foreground">Progression académique</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/courses")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Les Cours</h3>
                  <p className="text-sm text-muted-foreground">Cours en ligne</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/forums")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Les Forums</h3>
                  <p className="text-sm text-muted-foreground">Participez aux discussions</p>
                </Card>

                <Card className="p-6 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/wellness")}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Espace Bien-être</h3>
                  <p className="text-sm text-muted-foreground">Santé et bien-être</p>
                </Card>
              </div>

              {/* Original Tabs */}
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="contact">Contact Administration</TabsTrigger>
                  <TabsTrigger value="info">Informations CMC</TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                  <Card className="p-6 shadow-card">
                    <ContactInfo />
                  </Card>
                </TabsContent>

                <TabsContent value="info">
                  <Card className="p-6 shadow-card">
                    <InstitutionInfo />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduPath - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
