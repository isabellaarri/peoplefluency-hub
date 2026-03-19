import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Target, Clock, CheckCircle2, AlertTriangle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const pdis = [
  { name: "Aimee Nascimento", competencia: "Foco Estratégico e Analítico", plano: "Aprimorar análise de dados", acoes: [{ text: "Dashboard para reunião mensal", done: true }, { text: "Shadowing com referência em análise", done: false }, { text: "Curso Power BI", done: false }], progresso: 45, prazo: "Jun/2026", status: "Em dia" },
  { name: "Bruna Gavazzoni", competencia: "Inovação", plano: "Desenvolver pensamento criativo", acoes: [{ text: "Workshop Design Thinking", done: true }, { text: "Projeto piloto inovação", done: false }, { text: "Mentoria externa", done: false }], progresso: 30, prazo: "Jul/2026", status: "Em dia" },
  { name: "Lucas Silveira", competencia: "Conexão e Desenvolvimento", plano: "Fortalecer comunicação assertiva", acoes: [{ text: "Treinamento comunicação assertiva", done: false }, { text: "Liderar retrospectiva quinzenal", done: false }], progresso: 10, prazo: "Mai/2026", status: "Atrasado" },
  { name: "Ana Paula Ferreira", competencia: "Execução Ágil", plano: "Melhorar gestão de tempo", acoes: [{ text: "Implementar método GTD", done: true }, { text: "Check-in semanal com gestor", done: true }], progresso: 70, prazo: "Abr/2026", status: "Em dia" },
  { name: "Eduardo Paulino", competencia: "Foco Estratégico", plano: "Storytelling de dados", acoes: [{ text: "Curso storytelling", done: true }, { text: "Apresentar em All Hands", done: true }, { text: "Mentoria com CMO", done: false }], progresso: 55, prazo: "Jun/2026", status: "Em dia" },
];

export default function PDIPage() {
  const [search, setSearch] = useState("");
  const filtered = pdis.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader title="PDI" subtitle="Planos de Desenvolvimento Individual — modelo 70-20-10">
        <Button size="sm" className="gradient-brand text-primary-foreground border-0 text-[13px]">
          <Plus className="h-3.5 w-3.5 mr-1" /> Novo PDI
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="PDIs Ativos" value={156} icon={Target} variant="purple" />
        <StatCard title="Em Dia" value="78%" icon={CheckCircle2} variant="green" />
        <StatCard title="Atrasados" value={18} icon={AlertTriangle} variant="orange" />
        <StatCard title="Próximo Check-in" value="D+30" subtitle="22/04/2026" icon={Clock} variant="blue" />
      </div>

      {/* 70-20-10 */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { pct: "70%", title: "Experiências Práticas", desc: "Projetos, desafios, entregas reais" },
            { pct: "20%", title: "Aprendizado Social", desc: "Shadowing, mentoria, feedback" },
            { pct: "10%", title: "Educação Formal", desc: "Cursos, treinamentos, certificações" },
          ].map((m, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-gradient-brand">{m.pct}</p>
              <p className="text-[13px] font-medium text-foreground">{m.title}</p>
              <p className="text-[11px] text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Buscar colaborador..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-[13px]" />
      </div>

      {/* PDI Cards */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{p.name}</p>
                  <p className="text-[11px] text-primary">{p.competencia}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  p.status === "Em dia" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>{p.status}</span>
                <span className="text-[11px] text-muted-foreground">{p.prazo}</span>
              </div>
            </div>
            <p className="text-[13px] font-medium text-foreground mb-2 ml-11">{p.plano}</p>
            <div className="space-y-1.5 ml-11 mb-3">
              {p.acoes.map((a, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Checkbox checked={a.done} className="h-3.5 w-3.5" />
                  <span className={`text-[12px] ${a.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{a.text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 ml-11">
              <Progress value={p.progresso} className="flex-1 h-1.5" />
              <span className="text-[11px] font-medium text-muted-foreground">{p.progresso}%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
