import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "fr" | "ar" | "en";

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
    results: "Résultats",
    messaging: "Messages",
    wellness: "Bien-être",
    workTracking: "Suivi du travail",
    suggestions: "Suggestions",
    mainMenu: "Menu Principal",
    logout: "Déconnexion",
    changeLanguage: "Changer la langue",
    welcome: "Bienvenue sur EduPath",
    platform: "Plateforme de Gestion des Formations",
    trainingCenter: "Centre de Formation",
    welcomeMessage: "Bienvenue au Centre Multimédia d'Agadir",
    heroDescription: "Formation professionnelle d'excellence dans divers domaines",
    login: "Se connecter",
    profile: "Profil",
  },
  ar: {
    home: "الرئيسية",
    courses: "الدورات",
    forums: "المنتديات",
    library: "المكتبة",
    announcements: "الإعلانات",
    notifications: "الإشعارات",
    results: "النتائج",
    messaging: "الرسائل",
    wellness: "العافية",
    workTracking: "تتبع العمل",
    suggestions: "الاقتراحات",
    mainMenu: "القائمة الرئيسية",
    logout: "تسجيل الخروج",
    changeLanguage: "تغيير اللغة",
    welcome: "مرحبا بكم في EduPath",
    platform: "منصة إدارة التدريب المهني",
    trainingCenter: "مركز التدريب",
    welcomeMessage: "مرحباً بكم في المركز المتعدد الوسائط بأكادير",
    heroDescription: "تدريب مهني متميز في مجالات متنوعة",
    login: "تسجيل الدخول",
    profile: "الملف الشخصي",
  },
  en: {
    home: "Home",
    courses: "Courses",
    forums: "Forums",
    library: "Library",
    announcements: "Announcements",
    notifications: "Notifications",
    results: "Results",
    messaging: "Messages",
    wellness: "Wellness",
    workTracking: "Work Tracking",
    suggestions: "Suggestions",
    mainMenu: "Main Menu",
    logout: "Logout",
    changeLanguage: "Change Language",
    welcome: "Welcome to EduPath",
    platform: "Professional Training Management Platform",
    trainingCenter: "Training Center",
    welcomeMessage: "Welcome to Agadir Multimedia Center",
    heroDescription: "Professional training excellence in various fields",
    login: "Sign In",
    profile: "Profile",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
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
