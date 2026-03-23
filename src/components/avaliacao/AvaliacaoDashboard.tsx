import { StatCard } from "@/components/StatCard";
import { ClipboardCheck, Users, BarChart2, Grid3X3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currentCycle, departmentStats, sampleCollaborators, sampleResponses } from "@/data/evaluationData";
import { defaultCompetencies, evaluationTypes, calculateWeightedAverage, type EvaluationType } from "@/data/evaluationConfig";
import { Progress } from "@/components/ui/progress";

const scoreColor = (s: number) =>
  s >= 4 ? "text-success font-semibold" : s >= 3 ? "text-warning font-semibold" : s > 0 ? "text-destructive font-semibold" : "text-muted-foreground";

export function AvaliacaoDashboard() {
  // Calculate competency averages from sample data
  const competencyAverages = defaultCompetencies
    .filter((c) => c.category === "competencia")
    .map((c) => {
      const key = c.id === "foco_estrategico" ? "focoEstrategico" : c.id === "execucao_agil" ? "execucaoAgil" : c.id === "inovacao" ? "inovacao" : "conexaoDesenvolvimento";
      const scores = sampleResponses.map((r) => r.scores[key as keyof typeof r.scores]).filter((s): s is number => typeof s === "number" && s > 0);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { ...c, avg: Math.round(avg * 10) / 10 };
    });

  const loopAverages = defaultCompetencies
    .filter((c) => c.category === "loop_valor")
    .map((c) => {
      const keyMap: Record<string, string> = {
        fomento_comunidade: "fomentoComunidade",
        geracao_demanda: "geracaoDemanda",
        conversao_ia_humano: "conversaoIaHumano",
        entrega_encantadora: "entregaEncantadora",
        operacao_eficiente: "operacaoEficiente",
      };
      const key = keyMap[c.id];
      const scores = sampleResponses.map((r) => r.scores[key as keyof typeof r.scores]).filter((s): s is number => typeof s === "number" && s > 0);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { ...c, avg: Math.round(avg * 10) / 10 };
    });

  // Calculate weighted averages per collaborator
  const collaboratorResults = sampleCollaborators.slice(0, 8).map((collab) => {
    const responses = sampleResponses.filter((r) => r.evaluatedName === collab.name);
    const byType: Record<EvaluationType, number[]> = { autoavaliacao: [], lider_liderado: [], liderado_lider: [], par: [] };
    responses.forEach((r) => {
      const competencyScores = [r.scores.focoEstrategico, r.scores.execucaoAgil, r.scores.inovacao, r.scores.conexaoDesenvolvimento].filter((s) => s > 0);
      if (competencyScores.length > 0) {
        const avg = competencyScores.reduce((a, b) => a + b, 0) / competencyScores.length;
        byType[r.type].push(avg);
      }
    });
    const weights: Record<EvaluationType, number> = { autoavaliacao: 10, lider_liderado: 50, liderado_lider: 20, par: 20 };
    const weighted = calculateWeightedAverage(byType, weights);
    return { ...collab, weighted: Math.round(weighted * 10) / 10, responses: responses.length, status: responses.length > 0 ? "Completa" : "Pendente" };
  });

  const statusStyle: Record<string, string> = {
    Completa: "bg-success/10 text-success",
    Pendente: "bg-warning/10 text-warning",
    "Em andamento": "bg-info/10 text-info",
  };

  const colorMap = ["bg-primary", "bg-fluency-green", "bg-fluency-blue", "bg-fluency-pink"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cycle info */}
      <div className="flex items-center gap-3 text-[13px]">
        <Badge variant="secondary" className="bg-success/10 text-success border-0">
          {currentCycle.status}
        </Badge>
        <span className="text-muted-foreground">
          {currentCycle.startDate} → {currentCycle.endDate}
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">{currentCycle.totalCollaborators} colaboradores</span>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Avaliações" value={currentCycle.totalCollaborators} icon={ClipboardCheck} variant="purple" />
        <StatCard title="Completas" value={`${currentCycle.completionRate}%`} icon={BarChart2} variant="green" trend={{ value: "+12%", positive: true }} />
        <StatCard title="Gestores" value={30} icon={Users} variant="blue" />
        <StatCard title="Modelos" value="3" subtitle="180° / 270° / 360°" icon={Grid3X3} variant="orange" />
      </div>

      {/* Competency + Loop averages */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Médias por Competência</h2>
          <div className="space-y-3">
            {competencyAverages.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[12px] text-muted-foreground mb-1">{c.name}</p>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className={`h-1.5 rounded-full ${colorMap[i % colorMap.length]}`} style={{ width: `${(c.avg / 5) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground w-8 text-right">{c.avg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Médias Loop de Valor</h2>
          <div className="space-y-3">
            {loopAverages.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[12px] text-muted-foreground mb-1">{c.name}</p>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className={`h-1.5 rounded-full ${colorMap[i % colorMap.length]}`} style={{ width: `${(c.avg / 5) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground w-8 text-right">{c.avg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department completion */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Progresso por Departamento</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {departmentStats.map((d) => (
            <div key={d.dept} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[12px] font-medium text-foreground">{d.dept}</p>
                  <p className="text-[11px] text-muted-foreground">{d.completed}/{d.total}</p>
                </div>
                <Progress value={d.rate} className="h-1.5" />
              </div>
              <span className={`text-[12px] font-semibold w-10 text-right ${d.rate >= 80 ? "text-success" : d.rate >= 60 ? "text-warning" : "text-destructive"}`}>
                {d.rate}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weighted results table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Resultados Ponderados</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Pesos: Auto {evaluationTypes[0].weight}% • Líder→Lid {evaluationTypes[1].weight}% • Lid→Líder {evaluationTypes[2].weight}% • Par {evaluationTypes[3].weight}%
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Colaborador</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Área</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Modelo</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Respostas</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Nota Ponderada</th>
              </tr>
            </thead>
            <tbody>
              {collaboratorResults.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.cargo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{c.departamento}</td>
                  <td className="px-3 py-2.5 text-center">
                    <Badge variant="secondary" className="text-[11px] font-normal">{c.model}°</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle[c.status] || ""}`}>{c.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-muted-foreground">{c.responses}</td>
                  <td className={`px-3 py-2.5 text-center ${scoreColor(c.weighted)}`}>
                    {c.weighted > 0 ? c.weighted.toFixed(1) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
