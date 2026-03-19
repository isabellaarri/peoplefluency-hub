import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, Calendar, MessageSquare, CheckCircle2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const oneOnOnes = [
  { leader: "Jullie Costa", collaborator: "Aimee Nascimento", date: "15/03/2026", type: "Devolutiva", status: "Realizada", topics: ["Feedback SCCS — Foco Estratégico", "Definição de PDI", "Carreira e próximos passos"] },
  { leader: "Carlos Spezin", collaborator: "Bruna Gavazzoni", date: "14/03/2026", type: "Devolutiva", status: "Realizada", topics: ["Feedback positivo em execução", "PDI focado em inovação"] },
  { leader: "Thayna Simoes", collaborator: "Lucas Silveira", date: "18/03/2026", type: "Acompanhamento", status: "Agendada", topics: ["Check-in D+30", "Revisão de metas CRM"] },
  { leader: "Eduardo Paulino", collaborator: "Gisele Monteiro", date: "20/03/2026", type: "Devolutiva", status: "Agendada", topics: ["Avaliação 180°", "Plano de ação CX"] },
  { leader: "Vanessa Lopes", collaborator: "Ana Paula Ferreira", date: "13/03/2026", type: "Devolutiva", status: "Realizada", topics: ["Consenso de nota", "Enviado para People"] },
  { leader: "Aline Horie", collaborator: "Adriel Silva", date: "19/03/2026", type: "Acompanhamento", status: "Pendente", topics: [] },
];

const statusDot: Record<string, string> = {
  Realizada: "bg-success",
  Agendada: "bg-info",
  Pendente: "bg-warning",
};

export default function OneOnOnePage() {
  const [search, setSearch] = useState("");
  const filtered = oneOnOnes.filter(o =>
    o.leader.toLowerCase().includes(search.toLowerCase()) ||
    o.collaborator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="1:1" subtitle="Devolutivas, acompanhamento e feedback SCCS">
        <Button size="sm" className="gradient-brand text-primary-foreground border-0 text-[13px]">
          <Plus className="h-3.5 w-3.5 mr-1" /> Nova 1:1
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Realizadas" value={45} subtitle="Este ciclo" icon={CheckCircle2} variant="green" />
        <StatCard title="Agendadas" value={12} icon={Calendar} variant="blue" />
        <StatCard title="Pendentes" value={8} icon={Users} variant="orange" />
        <StatCard title="Conclusão" value="69%" icon={MessageSquare} variant="purple" trend={{ value: "+15%", positive: true }} />
      </div>

      {/* SCCS */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Modelo SCCS</h2>
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            { l: "S", t: "Situação", d: "Contexto específico", c: "border-l-primary" },
            { l: "C", t: "Comportamento", d: "O que foi observado", c: "border-l-fluency-blue" },
            { l: "C", t: "Consequência", d: "Impacto gerado", c: "border-l-fluency-orange" },
            { l: "S", t: "Solução (PDI)", d: "Caminho de desenvolvimento", c: "border-l-fluency-green" },
          ].map((s, i) => (
            <div key={i} className={`rounded-md border border-border border-l-[3px] ${s.c} bg-muted/20 p-3`}>
              <p className="text-lg font-bold text-foreground">{s.l}</p>
              <p className="text-[12px] font-medium text-foreground">{s.t}</p>
              <p className="text-[11px] text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-[13px]" />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((o, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {o.collaborator.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{o.collaborator}</p>
                  <p className="text-[11px] text-muted-foreground">com {o.leader}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">{o.date}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${statusDot[o.status]}`} />
                  <span className="text-[11px] font-medium text-muted-foreground">{o.status}</span>
                </div>
              </div>
            </div>
            {o.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-11">
                <span className="text-[11px] rounded bg-secondary px-2 py-0.5 text-secondary-foreground">{o.type}</span>
                {o.topics.map((t, j) => (
                  <span key={j} className="text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
