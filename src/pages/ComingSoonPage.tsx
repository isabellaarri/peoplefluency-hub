import { Construction, CheckCircle2 } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  module: string;
  moduleColor: string;
  features: string[];
}

export function ComingSoonPage({
  title,
  subtitle,
  module,
  moduleColor,
  features,
}: ComingSoonPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      {/* Module badge */}
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest"
        style={{ background: moduleColor + "18", color: moduleColor }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: moduleColor }}
        />
        {module}
      </span>

      {/* Icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
        style={{ background: moduleColor + "15" }}
      >
        <Construction
          className="h-7 w-7"
          style={{ color: moduleColor }}
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-[14px] text-muted-foreground mb-8 max-w-md">{subtitle}</p>

      {/* Features preview */}
      <div className="w-full max-w-md text-left rounded-xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          O que estará disponível
        </p>
        <ul className="space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                style={{ color: moduleColor }}
              />
              <span className="text-[13px] text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[12px] text-muted-foreground mt-6">
        Módulo em desenvolvimento · Fluency Pathway 2026
      </p>
    </div>
  );
}
