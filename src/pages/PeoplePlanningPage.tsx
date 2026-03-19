import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { GitBranch, Users, Briefcase, TrendingUp } from "lucide-react";

const phases = [
  { phase: "Estratégia e revisão do time", steps: ["Definição estratégica da área", "Conversa inicial com gerência", "Conexão com estratégia"], status: "done" },
  { phase: "Estrutura da área", steps: ["Headcount", "Organograma", "Revisão de cargos", "Job descriptions"], status: "done" },
  { phase: "Modelo de competências", steps: ["Levantamento de competências", "Mapa de competências"], status: "done" },
  { phase: "Estrutura de desenvolvimento", steps: ["Trilha de carreira", "Níveis de carreira", "Indicadores de performance"], status: "active" },
  { phase: "Diagnóstico do time", steps: ["Assessment", "Mapa de talentos", "Avaliação da área", "Resultados"], status: "active" },
  { phase: "Desenvolvimento", steps: ["Devolutiva", "PDIs", "Trilhas de desenvolvimento", "Reconhecimento"], status: "upcoming" },
];

const timeline = [
  { period: "Agora (16–31/03)", tasks: "Devolutivas individuais, Feedback SCCS, Consenso de nota", active: true },
  { period: "Curto Prazo (até 15/04)", tasks: "Liderado constrói PDI, Líder valida, Registro na Convenia", active: false },
  { period: "People Planning (abr/mai)", tasks: "Reunião com gerências, Mapeamento de time", active: false },
  { period: "Contínuo (D+30·60·90)", tasks: "Check-ins, Revisão de progresso, Ajustes de rota", active: false },
];

const phaseStatus: Record<string, string> = {
  done: "border-l-success",
  active: "border-l-primary",
  upcoming: "border-l-muted",
};

export default function PeoplePlanningPage() {
  return (
    <>
      <PageHeader title="People Planning" subtitle="Processo estruturado de mapeamento estratégico de time" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Áreas Mapeadas" value="8/12" icon={GitBranch} variant="purple" />
        <StatCard title="Headcount" value={247} icon={Users} variant="blue" />
        <StatCard title="Cargos" value={42} icon={Briefcase} variant="green" />
        <StatCard title="Fase Atual" value="Desenvolvimento" icon={TrendingUp} variant="orange" />
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Cronograma</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((t, i) => (
            <div key={i} className={`rounded-md border p-3 ${t.active ? "border-primary/30 bg-primary/5" : "border-border"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                {t.active && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                <p className="text-[12px] font-semibold text-foreground">{t.period}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{t.tasks}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Etapas</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p, i) => (
            <div key={i} className={`rounded-md border border-border border-l-[3px] ${phaseStatus[p.status]} p-3`}>
              <p className="text-[13px] font-medium text-foreground mb-2">{p.phase}</p>
              <div className="space-y-1">
                {p.steps.map((s, j) => (
                  <div key={j} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className={`h-1.5 w-1.5 rounded-full ${p.status === "done" ? "bg-success" : p.status === "active" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
