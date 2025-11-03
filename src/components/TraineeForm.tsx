import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Hammer,
  Plane,
  Leaf,
  Monitor,
  Factory,
  Wheat,
  TrendingUp,
  Palette,
  Building,
  Fish,
} from "lucide-react";

const trainingFields = [
  { value: "sante", label: "Santé", icon: Heart },
  { value: "artisanat", label: "Artisanat", icon: Hammer },
  { value: "tourisme", label: "Tourisme", icon: Plane },
  { value: "agriculture", label: "Agriculture", icon: Leaf },
  { value: "digital", label: "Digital", icon: Monitor },
  { value: "industrie", label: "Industrie", icon: Factory },
  { value: "agro-industrie", label: "Agro-industrie", icon: Wheat },
  { value: "gestion-commerce", label: "Gestion et commerce", icon: TrendingUp },
  { value: "art-graphique", label: "Art et industrie graphique", icon: Palette },
  { value: "btp", label: "BTP", icon: Building },
  { value: "peche", label: "Pèche", icon: Fish },
];

export function TraineeForm() {
  const [traineeName, setTraineeName] = useState("");
  const [trainingField, setTrainingField] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="trainee-name" className="text-base font-medium">
          Nom du stagiaire
        </Label>
        <Input
          id="trainee-name"
          placeholder="Entrez votre nom complet"
          value={traineeName}
          onChange={(e) => setTraineeName(e.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="training-field" className="text-base font-medium">
          Pôle de formation
        </Label>
        <Select value={trainingField} onValueChange={setTrainingField}>
          <SelectTrigger id="training-field" className="h-11">
            <SelectValue placeholder="Sélectionnez votre pôle" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {trainingFields.map((field) => {
              const Icon = field.icon;
              return (
                <SelectItem key={field.value} value={field.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{field.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
