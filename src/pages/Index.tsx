import { Card } from "@/components/ui/card";
import { TraineeForm } from "@/components/TraineeForm";
import { ContactInfo } from "@/components/ContactInfo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  CMC AGADIR
                </h1>
                <p className="text-xs text-muted-foreground">
                  Cité des Métiers et Compétences
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Plateforme de Gestion des Formations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bienvenue sur votre espace de formation professionnelle
            </p>
          </div>

          {/* Forms and Contact Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Trainee Information Card */}
            <Card className="p-6 shadow-card hover:shadow-lg transition-shadow">
              <h3 className="mb-6 text-xl font-semibold text-foreground">
                Informations du Stagiaire
              </h3>
              <TraineeForm />
            </Card>

            {/* Contact Information Card */}
            <Card className="p-6 shadow-card hover:shadow-lg transition-shadow">
              <ContactInfo />
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="bg-gradient-primary p-6 text-primary-foreground shadow-card">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                Établissement de Nouvelle Génération
              </h3>
              <p className="text-sm text-primary-foreground/90">
                La Cité des Métiers et des Compétences de Souss-Massa dispense une formation innovante,
                tournée vers les nouveaux métiers avec un modèle pédagogique libérateur d'énergies.
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CMC Souss-Massa - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
