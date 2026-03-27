import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButtons } from "@/components/ExportButtons";
import { GitBranch, Users, Target, Heart, ChevronRight, Briefcase, FileText } from "lucide-react";
import { sentimentStore, pdiStore, vacationStore } from "@/lib/dataStore";

/* ── Job Descriptions por Cluster ──────────────────────────── */
const jobDescriptions: Record<string, { resumo: string; responsabilidades: string[]; requisitos: string[] }> = {
  "C-LEVEL": {
    resumo: "Responsável pela visão estratégica e direção da empresa, reportando ao board.",
    responsabilidades: ["Definir estratégia global", "Liderar time executivo", "Relacionamento com investidores", "Cultura organizacional"],
    requisitos: ["10+ anos de liderança", "Experiência em escala", "Visão de negócio e produto"],
  },
  "DIRETOR": {
    resumo: "Lidera uma diretoria inteira, conectando estratégia à execução dos times.",
    responsabilidades: ["Desdobrar OKRs para áreas", "Gestão de gerentes", "Budget e headcount", "Relatórios executivos"],
    requisitos: ["7+ anos de gestão", "Experiência cross-funcional", "Pensamento estratégico"],
  },
  "GERENTE": {
    resumo: "Gerencia equipes e projetos garantindo entrega com qualidade e prazo.",
    responsabilidades: ["Gestão de pessoas (1:1, PDI, feedback)", "Planejamento de sprints", "Métricas de time", "Contratação"],
    requisitos: ["4+ anos de experiência", "Liderança de times 5+", "Gestão de projetos"],
  },
  "COORDENADOR": {
    resumo: "Coordena processos e suporta o gerente na gestão operacional do time.",
    responsabilidades: ["Organização de processos", "Acompanhamento de entregas", "Suporte a liderados", "Reporting"],
    requisitos: ["3+ anos na área", "Perfil organizacional", "Comunicação clara"],
  },
  "TL": {
    resumo: "Tech Lead responsável por decisões técnicas e mentoria do time.",
    responsabilidades: ["Arquitetura técnica", "Code review", "Mentoria", "Definição de padrões"],
    requisitos: ["5+ anos de desenvolvimento", "Liderança técnica", "Domínio de arquitetura"],
  },
  "ESPECIALISTA": {
    resumo: "Profissional sênior com domínio profundo em sua área de atuação.",
    responsabilidades: ["Referência técnica", "Projetos de alta complexidade", "Documentação", "Treinamentos"],
    requisitos: ["5+ anos de experiência", "Especialização comprovada", "Autonomia"],
  },
  "ANALISTA": {
    resumo: "Executa atividades técnicas e analíticas com autonomia crescente.",
    responsabilidades: ["Execução de tarefas", "Análise de dados", "Propostas de melhoria", "Colaboração cross-time"],
    requisitos: ["2+ anos de experiência", "Conhecimento técnico", "Proatividade"],
  },
  "ASSISTENTE": {
    resumo: "Suporta processos operacionais e administrativos da área.",
    responsabilidades: ["Suporte operacional", "Organização de documentos", "Atendimento interno", "Controle de agenda"],
    requisitos: ["Formação em andamento", "Organização", "Comunicação"],
  },
};

/* ── Fases do People Planning ──────────────────────────────── */
const phases = [
  { phase: "Estratégia e revisão do time", steps: ["Definição estratégica da área", "Conversa com gerência", "Conexão com estratégia"], status: "done" },
  { phase: "Estrutura da área", steps: ["Headcount", "Organograma", "Revisão de cargos", "Job descriptions"], status: "done" },
  { phase: "Modelo de competências", steps: ["Levantamento de competências", "Mapa de competências"], status: "done" },
  { phase: "Estrutura de desenvolvimento", steps: ["Trilha de carreira", "Níveis de carreira", "Indicadores de performance"], status: "active" },
  { phase: "Diagnóstico do time", steps: ["Assessment", "Mapa de talentos", "Avaliação da área", "Resultados"], status: "active" },
  { phase: "Desenvolvimento", steps: ["Devolutiva", "PDIs", "Trilhas de desenvolvimento", "Reconhecimento"], status: "upcoming" },
];

const phaseStyle: Record<string, { border: string; dot: string; label: string; badge: string }> = {
  done: { border: "border-l-fluency-green", dot: "bg-fluency-green", label: "Concluída", badge: "bg-fluency-green/10 text-fluency-green" },
  active: { border: "border-l-primary", dot: "bg-primary", label: "Em andamento", badge: "bg-primary/10 text-primary" },
  upcoming: { border: "border-l-muted-foreground/30", dot: "bg-muted-foreground/30", label: "Próxima", badge: "bg-muted text-muted-foreground" },
};

/* ── Componente ────────────────────────────────────────────── */
export default function PeoplePlanningPage() {
  const { allUsers } = useAuth();
  const [tab, setTab] = useState("organograma");
  const [selectedDept, setSelectedDept] = useState("todos");

  const allSentiments = sentimentStore.getAll();
  const allPdis = pdiStore.getAll();
  const allVacations = vacationStore.getAll();

  const activePdis = allPdis.filter((p) => p.status !== "concluido").length;
  const pendingVacations = allVacations.filter((v) => v.status === "pendente").length;

  const avgSentiment = useMemo(() => {
    const recent = allSentiments.filter((s) => Date.now() - new Date(s.date).getTime() < 30 * 86400000);
    return recent.length ? (recent.reduce((a, b) => a + b.score, 0) / recent.length).toFixed(1) : "—";
  }, [allSentiments]);

  const departments = useMemo(() => ["todos", ...Array.from(new Set(allUsers.map(u => u.departamento))).sort()], [allUsers]);

  const filteredUsers = selectedDept === "todos" ? allUsers : allUsers.filter(u => u.departamento === selectedDept);

  // Build org tree: gestor → diretos
  const orgTree = useMemo(() => {
    const tree: Record<string, AuthUser[]> = {};
    filteredUsers.forEach(u => {
      const gestor = u.gestorAtual || "Sem gestor";
      if (!tree[gestor]) tree[gestor] = [];
      tree[gestor].push(u);
    });
    return Object.entries(tree).sort((a, b) => b[1].length - a[1].length);
  }, [filteredUsers]);

  // Cluster breakdown
  const byCluster = useMemo(() => {
    const map: Record<string, number> = {};
    filteredUsers.forEach(u => { map[u.clusterCargo] = (map[u.clusterCargo] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredUsers]);

  // CSV export data
  const csvData = useMemo(() => allUsers.map(u => ({
    Nome: u.name,
    Email: u.email,
    Cargo: u.cargo,
    Departamento: u.departamento,
    Time: u.time,
    Cluster: u.clusterCargo,
    Vínculo: u.vinculo,
    Gestor: u.gestorAtual,
    "Data Admissão": u.dataAdmissao,
    Modelo: u.model + "°",
    "Centro de Custo": u.centroCusto,
  })), [allUsers]);

  const cltCount = filteredUsers.filter(u => u.vinculo === "CLT").length;
  const pjCount = filteredUsers.length - cltCount;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="People Planning" subtitle="Organograma, job descriptions e visão estratégica" />
        <ExportButtons
          csvData={csvData}
          csvFilename="people-planning-colaboradores"
          dashboardId="people-planning-content"
          dashboardFilename="people-planning"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Headcount" value={allUsers.length} icon={Users} variant="purple" />
        <StatCard title="PDIs Ativos" value={activePdis} icon={Target} variant="green" />
        <StatCard title="Sentimento médio" value={avgSentiment} subtitle="últimos 30 dias" icon={Heart} variant="pink" />
        <StatCard title="Férias pendentes" value={pendingVacations} icon={GitBranch} variant="orange" />
      </div>

      <div id="people-planning-content">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 p-0.5">
              <TabsTrigger value="organograma" className="text-[12px]">Organograma</TabsTrigger>
              <TabsTrigger value="jd" className="text-[12px]">Job Descriptions</TabsTrigger>
              <TabsTrigger value="fases" className="text-[12px]">Fases</TabsTrigger>
              <TabsTrigger value="dados" className="text-[12px]">Dados</TabsTrigger>
            </TabsList>

            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="w-[200px] h-8 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map(d => (
                  <SelectItem key={d} value={d} className="text-[12px]">
                    {d === "todos" ? "Todos os departamentos" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── ORGANOGRAMA ───────────────────────────── */}
          <TabsContent value="organograma">
            <div className="space-y-4">
              {orgTree.map(([gestor, membros]) => {
                const gestorUser = allUsers.find(u => u.name === gestor);
                return (
                  <div key={gestor} className="rounded-lg border border-border bg-card overflow-hidden">
                    {/* Gestor header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-xs font-bold text-white shrink-0">
                        {gestor.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground">{gestor}</p>
                        {gestorUser && (
                          <p className="text-[11px] text-muted-foreground">{gestorUser.cargo} · {gestorUser.departamento}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{membros.length} diretos</Badge>
                    </div>

                    {/* Diretos */}
                    <div className="divide-y divide-border">
                      {membros.map(m => (
                        <div key={m.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                          <div className="w-6 flex justify-center">
                            <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                          </div>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary shrink-0">
                            {m.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-foreground truncate">{m.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{m.cargo}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="outline" className="text-[9px]">{m.clusterCargo}</Badge>
                            <Badge variant={m.vinculo === "CLT" ? "secondary" : "outline"}
                              className={`text-[9px] ${m.vinculo === "CLT" ? "bg-fluency-blue/10 text-fluency-blue" : "border-fluency-orange/30 text-fluency-orange"}`}>
                              {m.vinculo}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {orgTree.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-12">Nenhum colaborador neste departamento</p>
              )}
            </div>
          </TabsContent>

          {/* ── JOB DESCRIPTIONS ──────────────────────── */}
          <TabsContent value="jd">
            <div className="grid gap-3 sm:grid-cols-2">
              {byCluster.map(([cluster, count]) => {
                const jd = jobDescriptions[cluster];
                return (
                  <div key={cluster} className="rounded-lg border border-border bg-card p-4 card-accent-left">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <h3 className="text-[13px] font-semibold text-foreground">{cluster}</h3>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{count} pessoas</Badge>
                    </div>

                    {jd ? (
                      <>
                        <p className="text-[11px] text-muted-foreground mb-3">{jd.resumo}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-1">Responsabilidades</p>
                            {jd.responsabilidades.map((r, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                {r}
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-1">Requisitos</p>
                            {jd.requisitos.map((r, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-fluency-green mt-1 shrink-0" />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">Job description não definida para este cluster</p>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ── FASES ─────────────────────────────────── */}
          <TabsContent value="fases">
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
          </TabsContent>

          {/* ── DADOS (tabela completa) ───────────────── */}
          <TabsContent value="dados">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Nome", "Cargo", "Cluster", "Departamento", "Vínculo", "Gestor", "Admissão"].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2 font-medium text-foreground">{u.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{u.cargo}</td>
                        <td className="px-3 py-2"><Badge variant="outline" className="text-[9px]">{u.clusterCargo}</Badge></td>
                        <td className="px-3 py-2 text-muted-foreground">{u.departamento}</td>
                        <td className="px-3 py-2">
                          <Badge variant="secondary" className={`text-[9px] ${u.vinculo === "CLT" ? "bg-fluency-blue/10 text-fluency-blue" : "bg-fluency-orange/10 text-fluency-orange"}`}>
                            {u.vinculo}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{u.gestorAtual}</td>
                        <td className="px-3 py-2 text-muted-foreground">{u.dataAdmissao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
