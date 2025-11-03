import { Building2, Users, Award, TrendingUp } from "lucide-react";

export function InstitutionInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          CMC Souss-Massa
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Établissement nouvelle génération, la Cité des Métiers et des Compétences de Souss-Massa 
          vise à dispenser une formation innovante, tournée vers les nouveaux métiers, grâce à un 
          modèle pédagogique libérateur d'énergies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">11 Pôles Métiers</h3>
            <p className="text-sm text-muted-foreground">
              Large éventail de formations innovantes
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Formation de Qualité</h3>
            <p className="text-sm text-muted-foreground">
              Équipements modernes et encadrement expert
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Certifications</h3>
            <p className="text-sm text-muted-foreground">
              Diplômes reconnus par l'État
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Insertion Professionnelle</h3>
            <p className="text-sm text-muted-foreground">
              Accompagnement vers l'emploi
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gradient-primary text-primary-foreground">
        <h3 className="font-semibold mb-2">Notre Mission</h3>
        <p className="text-sm text-primary-foreground/90">
          À travers une dynamique d'intelligence collective, la CMC représente un véritable 
          catalyseur de performances et une locomotive incontournable pour le développement de 
          la formation professionnelle dans la région Souss-Massa.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">Pôles de Formation</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Santé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Artisanat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Tourisme</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Agriculture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Industrie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Agro-industrie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Gestion et commerce</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Art et industrie graphique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">BTP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Pèche</span>
          </div>
        </div>
      </div>
    </div>
  );
}
