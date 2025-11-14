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
      <AppLayout>
        <div className="min-h-[calc(100vh-8rem)]">
          {/* Hero Section */}
          <div className="relative bg-gradient-hero rounded-xl overflow-hidden mb-8 shadow-card">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center opacity-20" />
            <div className="relative px-8 py-16 md:py-24">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                  اكتشف Cité des Métiers et des Compétences
                </h1>
                <p className="text-lg text-primary-foreground/90 mb-6">
                  مؤسسة من جيل جديد، تهدف إلى توفير تدريب مبتكر موجه نحو المهن الجديدة
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="bg-background text-primary hover:bg-background/90"
                >
                  سجل الآن
                </Button>
              </div>
            </div>
          </div>

          {/* Latest Announcement */}
          <div className="mb-8">
            <LatestAnnouncement />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Building className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">11</h3>
              <p className="text-muted-foreground">أقطاب المهن</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">+1000</h3>
              <p className="text-muted-foreground">المتدربين</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">95%</h3>
              <p className="text-muted-foreground">نسبة الإدماج</p>
            </Card>
          </div>

          {/* Institution Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 shadow-card">
              <InstitutionInfo />
            </Card>
            <Card className="p-6 shadow-card">
              <ContactInfo />
            </Card>
          </div>

          {/* Training Fields */}
          <Card className="p-6 shadow-card">
            <h2 className="text-2xl font-bold text-foreground mb-6">مجالات التدريب</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trainingFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.value}
                    className="flex flex-col items-center p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-center text-foreground">{field.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </AppLayout>
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
