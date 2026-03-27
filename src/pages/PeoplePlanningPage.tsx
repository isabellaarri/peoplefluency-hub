import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Users, Briefcase, TrendingUp, Heart, Target } from "lucide-react";
import { sentimentStore, pdiStore, vacationStore } from "@/lib/dataStore";

const phases = [
  { phase: "Estratégia e revisão do time", steps: ["Definição estratégica da área", "Conversa com gerência", "Conexão com estratégia"], status: "done" },
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

const phaseStyle: Record<string, { border: string; dot: string; label: string; badge: string }> = {
  done: { border: "border-l-fluency-green", dot: "bg-fluency-green", label: "Concluída", badge: "bg-fluency-green/10 text-fluency-green" },
  active: { border: "border-l-primary", dot: "bg-primary", label: "Em andamento", badge: "bg-primary/10 text-primary" },
  upcoming: { border: "border-l-muted-foreground/30", dot: "bg-muted-foreground/30", label: "Próxima", badge: "bg-muted text-muted-foreground" },
};

export default function PeoplePlanningPage() {
  const { allUsers } = useAuth();

  // Real data
  const allSentiments = sentimentStore.getAll();
  const allPdis = pdiStore.getAll();
  const allVacations = vacationStore.getAll();

  const activePdis = allPdis.filter((p) => p.status !== "concluido").length;
  const pendingVacations = allVacations.filter((v) => v.status === "pendente").length;

  const avgSentiment = useMemo(() => {
    if (allSentiments.length === 0) return "—";
    const recent = allSentiments.filter((s) => {
      const d = new Date(s.date);
      return Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
    });
    if (recent.length === 0) return "—";
    return (recent.reduce((a, b) => a + b.score, 0) / recent.length).toFixed(1);
  }, [allSentiments]);

  // Department breakdown
  const byDept = useMemo(() => {
    const map: Record<string, { count: number; leaders: number; clt: number; pj: number }> = {};
    allUsers.forEach((u) => {
      if (!map[u.departamento]) map[u.departamento] = { count: 0, leaders: 0, clt: 0, pj: 0 };
      map[u.departamento].count++;
      if (u.role === "leader" || u.role === "admin") map[u.departamento].leaders++;
      if (u.vinculo === "CLT") map[u.departamento].clt++;
      else map[u.departamento].pj++;
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [allUsers]);

  // Cluster breakdown
  const byCluster = useMemo(() => {
    const map: Record<string, number> = {};
    allUsers.forEach((u) => {
      map[u.clusterCargo] = (map[u.clusterCargo] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [allUsers]);

  const cltCount = allUsers.filter((u) => u.vinculo === "CLT").length;
  const pjCount = allUsers.filter((u) => u.vinculo !== "CLT").length;

  return (
    <>
      <PageHeader title="People Planning" subtitle="Visão estratégica e operacional do time" />

      {/* Stats reais */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Headcount" value={allUsers.length} icon={Users} variant="purple" />
        <StatCard title="PDIs Ativos" value={activePdis} icon={Target} variant="green" />
        <StatCard title="Sentimento médio" value={avgSentiment} subtitle="últimos 30 dias" icon={Heart} variant="pink" />
        <StatCard title="Férias pendentes" value={pendingVacations} icon={GitBranch} variant="orange" />
      </div>

      {/* CLT vs PJ */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tipo de vínculo</p>
          <div className="space-y-3">
            {[
              { label: "CLT", count: cltCount, color: "bg-fluency-blue", pct: Math.round((cltCount / allUsers.length) * 100) },
              { label: "PJ", count: pjCount, color: "bg-fluency-orange", pct: Math.round((pjCount / allUsers.length) * 100) },
            ].map((v) => (
              <div key={v.label}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-medium text-foreground">{v.label}</span>
                  <span className="text-muted-foreground">{v.count} ({v.pct}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${v.color}`} style={{ width: `${v.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster breakdown */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Distribuição por cluster</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {byCluster.map(([cluster, count]) => (
              <div key={cluster} className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-muted/40 text-[12px]">
                <span className="text-foreground font-medium truncate">{cluster}</span>
                <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department breakdown */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Headcount por departamento</p>
        <div className="space-y-2">
          {byDept.map(([dept, data]) => (
            <div key={dept} className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-foreground w-48 truncate shrink-0">{dept}</span>
              <div className="flex-1 h-5 bg-muted rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center px-2"
                  style={{
                    width: `${Math.max((data.count / byDept[0][1].count) * 100, 8)}%`,
                    background: "linear-gradient(90deg, hsl(256 74% 59%), hsl(252 100% 73%))",
                  }}
                >
                  <span className="text-[10px] font-bold text-white">{data.count}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {data.clt > 0 && <Badge variant="outline" className="text-[9px] border-fluency-blue/30 text-fluency-blue px-1.5">{data.clt} CLT</Badge>}
                {data.pj > 0 && <Badge variant="outline" className="text-[9px] border-fluency-orange/30 text-fluency-orange px-1.5">{data.pj} PJ</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cronograma */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cronograma</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((t, i) => (
            <div key={i} className={`rounded-md border p-3 ${t.active ? "border-primary/30 bg-primary/5" : "border-border"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                {t.active && <div className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />}
                <p className="text-[12px] font-semibold text-foreground">{t.period}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{t.tasks}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fases */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Etapas do processo</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p, i) => {
            const style = phaseStyle[p.status];
            return (
              <div key={i} className={`rounded-md border border-border border-l-[3px] ${style.border} p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-semibold text-foreground">{p.phase}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${style.badge}`}>{style.label}</span>
                </div>
                <div className="space-y-1">
                  {p.steps.map((s, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
