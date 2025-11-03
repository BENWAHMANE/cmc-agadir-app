import { Phone, Mail } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Contact Administration
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground">Téléphone</p>
            <div className="space-y-0.5">
              <a 
                href="tel:0607646271"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                06 07 64 62 71
              </a>
              <a 
                href="tel:0621177469"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                06 21 17 74 69
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground">Email</p>
            <div className="space-y-0.5">
              <a 
                href="mailto:souhaila.arroub@ofppt.ma"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors break-all"
              >
                souhaila.arroub@ofppt.ma
              </a>
              <a 
                href="mailto:abdelhamid.inajjaren@ofppt.ma"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors break-all"
              >
                abdelhamid.inajjaren@ofppt.ma
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
