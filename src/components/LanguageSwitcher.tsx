import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

type LanguageOption = {
  code: "fr" | "ar" | "en";
  label: string;
};

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const languages: LanguageOption[] = [
    { code: "fr", label: "Français" },
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
  ];

  const handleLanguageChange = (code: "fr" | "ar" | "en") => {
    setLanguage(code);
    // Force re-render by updating localStorage
    localStorage.setItem('edupath-language', code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={language === lang.code ? "bg-accent font-medium" : ""}
          >
            {lang.label}
            {language === lang.code && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
