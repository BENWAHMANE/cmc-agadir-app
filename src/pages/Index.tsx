import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/components/ContactInfo";
import { InstitutionInfo } from "@/components/InstitutionInfo";
import { Loader2, Save } from "lucide-react";
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
  Users,
  Award,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { LatestAnnouncement } from "@/components/LatestAnnouncement";
import { HeroSection } from "@/components/HeroSection";
import edupathCmcLogo from "@/assets/edupath-cmc-logo.jpeg";

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

      toast.success("Profil enregistré avec succès!");
      await loadProfile(user.id);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erreur lors de l'enregistrement du profil");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Logo Section */}
          <div className="flex justify-center pt-4">
            <img 
              src={edupathCmcLogo} 
              alt="EduPath CMC Logo" 
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>
          
          <HeroSection />
          
          <LatestAnnouncement />

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-8 text-center space-y-3 bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-glow transition-all group">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">1000+</div>
              <p className="text-muted-foreground font-medium">Stagiaires formés</p>
            </Card>
            <Card className="p-8 text-center space-y-3 bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-glow transition-all group">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">15+</div>
              <p className="text-muted-foreground font-medium">Années d'expérience</p>
            </Card>
            <Card className="p-8 text-center space-y-3 bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-glow transition-all group">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">11</div>
              <p className="text-muted-foreground font-medium">Filières de formation</p>
            </Card>
          </div>

          {/* Training Fields Grid */}
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Nos Filières de Formation</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos programmes de formation professionnelle dans divers secteurs d'activité
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingFields.map((field) => {
                const Icon = field.icon;
                return (
                  <Card 
                    key={field.value}
                    className="group overflow-hidden bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-glow transition-all cursor-pointer"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all">
                          <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wide">
                          Formation
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        {field.label}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Formation professionnelle de qualité dans le domaine {field.label.toLowerCase()}
                      </p>
                      
                      <div className="pt-2 text-xs text-muted-foreground">
                        En savoir plus →
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <InstitutionInfo />
          <ContactInfo />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <LatestAnnouncement />
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="info">معلومات المركز</TabsTrigger>
              <TabsTrigger value="profile">ملفي الشخصي</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <InstitutionInfo />
                </Card>
                <Card className="p-6">
                  <ContactInfo />
                </Card>
              </div>

              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  مجالات التدريب
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trainingFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.value}
                        className={`flex flex-col items-center p-4 rounded-lg transition-colors cursor-pointer ${
                          trainingField === field.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent/50 hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-8 w-8 mb-2" />
                        <span className="text-sm text-center">{field.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6">
                {!profile ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        إنشاء ملف شخصي
                      </h2>
                      <p className="text-muted-foreground">
                        الرجاء ملء المعلومات التالية لإكمال ملفك الشخصي
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="trainee-name">اسم المتدرب</Label>
                        <Input
                          id="trainee-name"
                          value={traineeName}
                          onChange={(e) => setTraineeName(e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="training-field">مجال التدريب</Label>
                        <Select
                          value={trainingField}
                          onValueChange={setTrainingField}
                        >
                          <SelectTrigger id="training-field">
                            <SelectValue placeholder="اختر مجال التدريب" />
                          </SelectTrigger>
                          <SelectContent>
                            {trainingFields.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="ml-2 h-4 w-4" />
                            حفظ الملف الشخصي
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        ملفي الشخصي
                      </h2>
                      <p className="text-muted-foreground">
                        يمكنك تحديث معلوماتك الشخصية هنا
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="trainee-name-edit">اسم المتدرب</Label>
                        <Input
                          id="trainee-name-edit"
                          value={traineeName}
                          onChange={(e) => setTraineeName(e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="training-field-edit">مجال التدريب</Label>
                        <Select
                          value={trainingField}
                          onValueChange={setTrainingField}
                        >
                          <SelectTrigger id="training-field-edit">
                            <SelectValue placeholder="اختر مجال التدريب" />
                          </SelectTrigger>
                          <SelectContent>
                            {trainingFields.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري التحديث...
                          </>
                        ) : (
                          <>
                            <Save className="ml-2 h-4 w-4" />
                            تحديث الملف الشخصي
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
