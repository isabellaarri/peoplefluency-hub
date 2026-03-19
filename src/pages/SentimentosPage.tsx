import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Heart, TrendingUp, TrendingDown, Smile, Frown, Meh, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const sentimentData = [
  { team: "Cursos", avg: 4.7, trend: "+0.5", positive: true, responses: 20 },
  { team: "Marketing", avg: 4.5, trend: "+0.2", positive: true, responses: 18 },
  { team: "Tecnologia", avg: 4.2, trend: "+0.4", positive: true, responses: 15 },
  { team: "NINA", avg: 4.0, trend: "+0.1", positive: true, responses: 8 },
  { team: "Revenue", avg: 3.8, trend: "-0.1", positive: false, responses: 24 },
  { team: "CX", avg: 3.5, trend: "-0.3", positive: false, responses: 12 },
];

const feedback = [
  { text: "Me sinto muito apoiada pelo meu líder, mas gostaria de mais clareza nos objetivos da área.", sentiment: "positive" },
  { text: "A carga de trabalho está pesada, precisamos de mais pessoas na equipe.", sentiment: "negative" },
  { text: "Adorei o novo processo de 1:1, me sinto ouvida e valorizada.", sentiment: "positive" },
  { text: "Gostaria de ter mais oportunidades de desenvolvimento e treinamentos.", sentiment: "neutral" },
  { text: "O ambiente é colaborativo, sinto que posso contar com meus colegas.", sentiment: "positive" },
];

const moodIcon = (s: string) => {
  if (s === "positive") return <Smile className="h-4 w-4 text-success" />;
  if (s === "negative") return <Frown className="h-4 w-4 text-destructive" />;
  return <Meh className="h-4 w-4 text-warning" />;
};

export default function SentimentosPage() {
  return (
    <>
      <PageHeader title="Sentimentos" subtitle="Pulse check contínuo — como sua equipe está se sentindo?">
        <Button size="sm" className="gradient-brand text-primary-foreground border-0 text-[13px]">
          <Plus className="h-3.5 w-3.5 mr-1" /> Nova Pesquisa
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Sentimento Geral" value="4.1" subtitle="de 5.0" icon={Heart} variant="pink" trend={{ value: "+0.2", positive: true }} />
        <StatCard title="Respostas" value={97} subtitle="de 247" icon={Smile} variant="green" />
        <StatCard title="Melhor" value="Cursos" subtitle="4.7" icon={TrendingUp} variant="blue" />
        <StatCard title="Atenção" value="CX" subtitle="3.5" icon={TrendingDown} variant="orange" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Teams */}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-foreground mb-3">Por Time</h2>
          <div className="space-y-2">
            {sentimentData.map((t, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
                <span className="text-[13px] font-medium text-foreground w-24">{t.team}</span>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${t.avg >= 4 ? "bg-success" : t.avg >= 3.5 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${(t.avg / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground w-8 text-right">{t.avg}</span>
                <span className={`text-[11px] font-medium w-10 text-right ${t.positive ? "text-success" : "text-destructive"}`}>
                  {t.positive ? "↑" : "↓"}{t.trend}
                </span>
                <span className="text-[11px] text-muted-foreground w-16 text-right">{t.responses} resp.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground mb-3">Feedback Anônimo</h2>
          <div className="space-y-2">
            {feedback.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
                <div className="mt-0.5 shrink-0">{moodIcon(f.sentiment)}</div>
                <p className="text-[12px] text-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
