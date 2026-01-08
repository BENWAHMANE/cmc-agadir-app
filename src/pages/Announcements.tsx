import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppLayout } from "@/components/AppLayout";
import { isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  image_url?: string;
}

interface GroupedAnnouncements {
  today: Announcement[];
  thisWeek: Announcement[];
  thisMonth: Announcement[];
  older: Announcement[];
}

const Announcements = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadAnnouncements();
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadAnnouncements();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = null;

      // Upload image if provided
      if (newImageFile) {
        const fileExt = newImageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `announcements/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("institution-images")
          .upload(filePath, newImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("institution-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("announcements")
        .insert({
          title: newTitle,
          content: newContent,
          author_id: user.id,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast.success("Annonce publiée avec succès");
      setNewTitle("");
      setNewContent("");
      setNewImageFile(null);
      setIsCreating(false);
      loadAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Erreur lors de la publication");
    } finally {
      setUploading(false);
    }
  };

  const groupAnnouncements = (items: Announcement[]): GroupedAnnouncements => {
    const groups: GroupedAnnouncements = {
      today: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    };

    items.forEach((item) => {
      const date = parseISO(item.created_at);
      if (isToday(date)) {
        groups.today.push(item);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(item);
      } else if (isThisMonth(date)) {
        groups.thisMonth.push(item);
      } else {
        groups.older.push(item);
      }
    });

    return groups;
  };

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <Card key={announcement.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{announcement.title}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(announcement.created_at).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {announcement.image_url && (
          <div className="flex justify-center mb-4">
            <img 
              src={announcement.image_url} 
              alt={announcement.title}
              className="max-w-48 max-h-48 rounded-lg object-contain"
            />
          </div>
        )}
        <p className="whitespace-pre-wrap text-muted-foreground">{announcement.content}</p>
      </CardContent>
    </Card>
  );

  const GroupSection = ({ title, icon, items }: { title: string; icon: React.ReactNode; items: Announcement[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold border-b border-primary/20 pb-2">
          {icon}
          <span>{title}</span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div className="space-y-4">
          {items.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>
    );
  };

  const GroupedAnnouncementsList = ({ announcements }: { announcements: Announcement[] }) => {
    const grouped = useMemo(() => groupAnnouncements(announcements), [announcements]);
    
    return (
      <div className="space-y-8">
        <GroupSection title="Plus ancien" icon={<Calendar className="h-4 w-4" />} items={grouped.older} />
        <GroupSection title="Aujourd'hui" icon={<Calendar className="h-4 w-4" />} items={grouped.today} />
        <GroupSection title="Cette semaine" icon={<Calendar className="h-4 w-4" />} items={grouped.thisWeek} />
        <GroupSection title="Ce mois" icon={<Calendar className="h-4 w-4" />} items={grouped.thisMonth} />
      </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Les Annonces et Événements</h1>
            <p className="text-muted-foreground">Restez informé des dernières nouvelles</p>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle annonce
          </Button>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Créer une annonce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Titre de l'annonce"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Contenu</label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Contenu de l'annonce"
                  rows={5}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Image (optionnel)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAnnouncement} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Publier
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune annonce pour le moment
              </CardContent>
            </Card>
          ) : (
            <GroupedAnnouncementsList announcements={announcements} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Announcements;
