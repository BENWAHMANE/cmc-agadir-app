import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface HeroImage {
  id: string;
  title: string;
  image_url: string;
}

export function HeroSection() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHeroImage();
  }, []);

  const loadHeroImage = async () => {
    try {
      const { data } = await supabase
        .from("institution_images")
        .select("id, title, image_url")
        .eq("image_type", "hero")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (data) {
        setHeroImage(data);
      }
    } catch (error) {
      console.error("Error loading hero image:", error);
    }
  };

  const backgroundImage = heroImage
    ? heroImage.image_url
    : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";

  return (
    <div className="relative bg-gradient-hero rounded-xl overflow-hidden mb-8 shadow-card">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
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
  );
}
