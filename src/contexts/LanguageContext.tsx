import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    home: "Accueil",
    courses: "Cours",
    forums: "Forums",
    library: "Bibliothèque",
    announcements: "Annonces",
    notifications: "Notifications",
    schedule: "Emploi du temps",
    messaging: "Messages",
    wellness: "Bien-être",
    workTracking: "Images",
    suggestions: "Suggestions",
    mainMenu: "Menu Principal",
    logout: "Déconnexion",
    changeLanguage: "Changer la langue",
    welcome: "Bienvenue sur EduPath",
    platform: "Plateforme de Gestion des Formations",
    trainingCenter: "Centre de Formation",
    welcomeMessage: "Bienvenue à EDUPATH",
    heroDescription: "Votre chemin vers votre avenir",
    login: "Se connecter",
    profile: "Profil",
  },
  en: {
    home: "Home",
    courses: "Courses",
    forums: "Forums",
    library: "Library",
    announcements: "Announcements",
    notifications: "Notifications",
    schedule: "Schedule",
    messaging: "Messages",
    wellness: "Wellness",
    workTracking: "Images",
    suggestions: "Suggestions",
    mainMenu: "Main Menu",
    logout: "Logout",
    changeLanguage: "Change Language",
    welcome: "Welcome to EduPath",
    platform: "Professional Training Management Platform",
    trainingCenter: "Training Center",
    welcomeMessage: "Welcome to EDUPATH",
    heroDescription: "Your path towards your future",
    login: "Sign In",
    profile: "Profile",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('edupath-language');
    // Only accept valid languages (fr or en), default to fr
    if (saved === "fr" || saved === "en") {
      return saved;
    }
    return "fr";
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    localStorage.setItem('edupath-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
