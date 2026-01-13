import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/images/gallery/classroom-1.jpeg",
    alt: "Salle de classe",
    title: "Séance en classe",
  },
  {
    id: "2",
    src: "/images/gallery/classroom-2.jpeg",
    alt: "Groupe d'étudiants",
    title: "Nos stagiaires",
  },
  {
    id: "3",
    src: "/images/gallery/auditorium-1.jpeg",
    alt: "Amphithéâtre",
    title: "Conférence",
  },
  {
    id: "4",
    src: "/images/gallery/conference-1.jpeg",
    alt: "Présentation",
    title: "Présentation",
  },
  {
    id: "5",
    src: "/images/gallery/conference-2.jpeg",
    alt: "Événement",
    title: "Événement au CMC",
  },
];

const WorkTracking = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Galerie Photos</h1>
          <p className="text-muted-foreground">Découvrez notre établissement et nos activités</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            {selectedImage && (
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <h3 className="text-white text-lg font-medium">{selectedImage.title}</h3>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default WorkTracking;
