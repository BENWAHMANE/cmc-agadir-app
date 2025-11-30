import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export function LatestAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestAnnouncement();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        () => {
          loadLatestAnnouncement();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLatestAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setAnnouncement(data);
    } catch (error) {
      console.error("Error loading announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            آخر إعلان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </CardContent>
      </Card>
    );
  }

  if (!announcement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            آخر إعلان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">لا توجد إعلانات حالياً</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          {announcement.title}
        </CardTitle>
        <CardDescription>
          {new Date(announcement.created_at).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {announcement.image_url && (
          <img 
            src={announcement.image_url} 
            alt={announcement.title}
            className="w-full rounded-lg mb-4"
          />
        )}
        <p className="whitespace-pre-wrap">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}
