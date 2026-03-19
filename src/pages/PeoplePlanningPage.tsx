import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { GitBranch, Users, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const phases = [
  { phase: "Estratégia e revisão do time", steps: ["Definição estratégica da área", "Conversa inicial com gerência", "Conexão com estratégia"], color: "border-primary/30 bg-primary/5" },
  { phase: "Estrutura da área", steps: ["Levantamento de headcount", "Construção do organograma", "Revisão de cargos", "Atualização de job descriptions"], color: "border-fluency-blue/30 bg-fluency-blue/5" },
  { phase: "Modelo de competências", steps: ["Levantamento de competências", "Mapa de competências"], color: "border-fluency-green/30 bg-fluency-green/5" },
  { phase: "Estrutura de desenvolvimento", steps: ["Trilha de carreira", "Níveis de carreira", "Indicadores de performance"], color: "border-fluency-orange/30 bg-fluency-orange/5" },
  { phase: "Diagnóstico do time", steps: ["Assessment", "Mapa de talentos", "Avaliação da área", "Resultados"], color: "border-fluency-pink/30 bg-fluency-pink/5" },
  { phase: "Desenvolvimento", steps: ["Devolutiva da avaliação", "Criação de PDIs", "Trilhas de desenvolvimento", "Reconhecimento"], color: "border-primary/30 bg-primary/5" },
];

const timeline = [
  { period: "Agora (16–31/03)", tasks: "Devolutivas individuais, Feedback SCCS, Consenso de nota", status: "active" },
  { period: "Curto Prazo (até 15/04)", tasks: "Liderado constrói PDI, Líder valida, Registro na Convenia", status: "upcoming" },
  { period: "People Planning (abr/mai)", tasks: "Reunião com gerências, Mapeamento de time, Revisão de PDIs", status: "upcoming" },
  { period: "Contínuo (D+30·60·90)", tasks: "Check-ins de acompanhamento, Revisão de progresso, Ajustes de rota", status: "future" },
];

const statusStyles: Record<string, string> = {
  active: "border-success/50 bg-success/5",
  upcoming: "border-info/50 bg-info/5",
  future: "border-border bg-muted/20",
};

export default function PeoplePlanningPage() {
  return (
    <>
      <PageHeader title="People Planning" subtitle="Processo estruturado de mapeamento estratégico de time" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Áreas Mapeadas" value="8" subtitle="de 12" icon={GitBranch} variant="purple" />
        <StatCard title="Headcount" value={247} icon={Users} variant="blue" />
        <StatCard title="Cargos Definidos" value={42} icon={Briefcase} variant="green" />
        <StatCard title="Fase Atual" value="Desenvolvimento" icon={TrendingUp} variant="orange" />
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Cronograma</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((t, i) => (
            <div key={i} className={`rounded-lg border-2 p-4 ${statusStyles[t.status]}`}>
              <div className="flex items-center gap-2 mb-2">
                {t.status === "active" && <div className="h-2 w-2 rounded-full bg-success animate-pulse" />}
                <span className="text-sm font-bold text-foreground">{t.period}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.tasks}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Phases */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Etapas do People Planning</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p, i) => (
            <div key={i} className={`rounded-xl border-2 p-5 ${p.color}`}>
              <h3 className="text-sm font-bold text-foreground mb-3">{p.phase}</h3>
              <div className="space-y-2">
                {p.steps.map((s, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
