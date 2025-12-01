import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroImage {
  id: string;
  title: string;
  image_url: string;
}

export function HeroSection() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <div className="relative h-[500px] flex items-center justify-center overflow-hidden rounded-xl mb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      <div className="relative z-20 text-center space-y-6 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
          {t("welcomeMessage")}
        </h1>
        
        <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-lg">
          {t("heroDescription")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="group bg-white text-primary hover:bg-white/90 shadow-lg"
          >
            {t("login")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
