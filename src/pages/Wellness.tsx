import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Loader2, Home, Brain, Heart, Music, Scale, Users, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import edupathLogo from "@/assets/edupath-logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const wellnessCategories = [
  {
    id: "mental",
    title: "Bien-être mental",
    icon: <Brain className="h-6 w-6" />,
    color: "from-purple-500/20 to-purple-600/10",
    items: [
      {
        title: "Gestion du stress",
        content: "Les études peuvent être stressantes, mais tu peux apprendre à mieux gérer cette pression. Prends des pauses régulières, divise tes tâches en petites étapes et n'oublie pas de célébrer tes petites victoires. Le stress fait partie de la vie, mais il ne doit pas te contrôler."
      },
      {
        title: "Gestion du temps",
        content: "Organise ton emploi du temps de manière réaliste. Utilise un agenda ou une application pour planifier tes cours, révisions et moments de détente. Commence par les tâches les plus difficiles quand tu es le plus concentré(e). N'oublie pas de prévoir du temps pour toi !"
      },
      {
        title: "Confiance en soi",
        content: "Tu as ta place ici et tu mérites de réussir. Rappelle-toi de tes accomplissements passés et sois bienveillant(e) envers toi-même. Chaque erreur est une opportunité d'apprentissage. Tu es capable de plus que tu ne le penses."
      },
      {
        title: "Exercices de respiration",
        content: "Quand tu te sens submergé(e), essaie la technique 4-7-8 : inspire pendant 4 secondes, retiens ta respiration 7 secondes, expire lentement pendant 8 secondes. Répète 3-4 fois. Cette technique simple peut t'aider à retrouver ton calme en quelques minutes."
      }
    ]
  },
  {
    id: "physical",
    title: "Bien-être physique",
    icon: <Heart className="h-6 w-6" />,
    color: "from-red-500/20 to-red-600/10",
    items: [
      {
        title: "Alimentation saine",
        content: "Ton cerveau a besoin de bons nutriments pour fonctionner. Privilégie les fruits, légumes, protéines et céréales complètes. Évite de sauter des repas, surtout le petit-déjeuner. L'hydratation est aussi essentielle : bois au moins 1,5L d'eau par jour."
      },
      {
        title: "L'importance du sport",
        content: "L'activité physique libère des endorphines qui améliorent ton humeur et ta concentration. Même 30 minutes de marche par jour peuvent faire une grande différence. Trouve une activité qui te plaît : danse, natation, vélo, ou simplement une promenade entre amis."
      },
      {
        title: "Le sommeil",
        content: "Un bon sommeil est crucial pour la mémorisation et la concentration. Essaie de dormir 7-8 heures par nuit et maintiens des horaires réguliers. Évite les écrans une heure avant de dormir et crée un environnement calme et sombre dans ta chambre."
      }
    ]
  },
  {
    id: "relaxation",
    title: "Relaxation",
    icon: <Music className="h-6 w-6" />,
    color: "from-green-500/20 to-green-600/10",
    items: [
      {
        title: "Musique relaxante",
        content: "La musique peut transformer ton état d'esprit. Crée une playlist de musiques calmes pour étudier ou te détendre. Les sons de la nature, la musique classique ou le lo-fi sont particulièrement apaisants. Prends le temps d'écouter et de te laisser porter."
      },
      {
        title: "Méditation",
        content: "La méditation n'est pas réservée aux experts ! Commence par 5 minutes par jour. Assieds-toi confortablement, ferme les yeux et concentre-toi sur ta respiration. Si ton esprit s'évade, ramène doucement ton attention. Des applications gratuites peuvent te guider."
      },
      {
        title: "Pauses entre les cours",
        content: "Ton cerveau a besoin de pauses pour assimiler les informations. Après 45-50 minutes d'étude, fais une pause de 10 minutes. Lève-toi, étire-toi, regarde par la fenêtre. Ces moments de récupération améliorent ta productivité et ta créativité."
      }
    ]
  },
  {
    id: "balance",
    title: "Équilibre études / vie personnelle",
    icon: <Scale className="h-6 w-6" />,
    color: "from-blue-500/20 to-blue-600/10",
    items: [
      {
        title: "Motivation",
        content: "La motivation fluctue et c'est normal. Rappelle-toi pourquoi tu as choisi cette formation. Fixe-toi des objectifs clairs et réalisables. Entoure-toi de personnes positives qui te soutiennent. Et quand c'est difficile, rappelle-toi que tu n'es pas seul(e)."
      },
      {
        title: "Prévention du burnout",
        content: "Le burnout arrive quand on pousse trop loin, trop longtemps. Reconnais les signes : fatigue persistante, perte de motivation, irritabilité. Accorde-toi des moments de repos sans culpabilité. Ta santé est plus importante que n'importe quel examen."
      },
      {
        title: "Organisation",
        content: "Un bon équilibre nécessite une bonne organisation. Planifie tes études mais aussi tes loisirs, tes moments en famille et avec tes amis. Apprends à dire non quand c'est nécessaire. Un emploi du temps équilibré est la clé d'une vie étudiante épanouie."
      }
    ]
  },
  {
    id: "support",
    title: "Soutien et accompagnement",
    icon: <Users className="h-6 w-6" />,
    color: "from-amber-500/20 to-amber-600/10",
    items: [
      {
        title: "Demander de l'aide",
        content: "Demander de l'aide est un signe de force, pas de faiblesse. Que ce soit pour tes études ou ton bien-être, n'hésite jamais à parler à un formateur, un camarade, ou un professionnel. Tu n'as pas à tout gérer seul(e)."
      },
      {
        title: "Un espace bienveillant",
        content: "Notre établissement est un lieu où chacun peut s'exprimer sans jugement. Tes difficultés sont valides et méritent d'être entendues. L'équipe pédagogique est là pour t'accompagner dans ton parcours, avec bienveillance et respect."
      },
      {
        title: "Ressources disponibles",
        content: "N'oublie pas que tu as accès à différentes ressources : le service d'orientation, les groupes d'entraide entre étudiants, et les permanences de soutien. Prends soin de toi, car tu mérites de réussir dans les meilleures conditions."
      }
    ]
  }
];

const Wellness = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={edupathLogo} alt="EduPath Logo" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate("/")} className="h-9 w-9">
                <Home className="h-4 w-4" />
              </Button>
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="outline" size="icon" onClick={handleLogout} className="h-9 w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">🌿 Espace Bien-être</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prends soin de toi. Ta réussite académique passe aussi par ton bien-être personnel. 
              Ici, tu trouveras des conseils et ressources pour t'épanouir pleinement.
            </p>
          </div>

          {/* Wellness Categories */}
          <div className="space-y-6">
            {wellnessCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden shadow-card">
                <div className={`bg-gradient-to-r ${category.color} p-4 border-b`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/50">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">{category.title}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium text-foreground">{item.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Card>
            ))}
          </div>

          {/* Encouraging Footer */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center space-y-3">
              <p className="text-lg font-medium text-foreground">
                💪 Tu n'es pas seul(e) dans ton parcours
              </p>
              <p className="text-muted-foreground">
                N'hésite jamais à demander de l'aide. L'équipe pédagogique et tes camarades sont là pour toi.
                Ensemble, nous pouvons surmonter tous les défis.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Wellness;
