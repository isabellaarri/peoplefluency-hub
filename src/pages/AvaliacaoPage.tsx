import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ClipboardCheck, Users, BarChart2, Grid3X3, Search, Filter, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const evaluations = [
  { name: "Aimee Nascimento", role: "Coord. Experiência Educacional", dept: "Cursos", model: "360°", status: "Completa", gestor: "Jullie Costa", competencias: { estrategico: 4, execucao: 4, inovacao: 3, conexao: 4 } },
  { name: "Carlos Spezin", role: "Gerente Revenue", dept: "Revenue", model: "360°", status: "Completa", gestor: "Rhavi Sant'Ana", competencias: { estrategico: 5, execucao: 4, inovacao: 4, conexao: 5 } },
  { name: "Ana Vazquez", role: "Coord. Conteúdo", dept: "Cursos", model: "270°", status: "Pendente", gestor: "Marcus Ramos", competencias: { estrategico: 0, execucao: 0, inovacao: 0, conexao: 0 } },
  { name: "Bruna Gavazzoni", role: "Gerente B2B", dept: "Revenue", model: "360°", status: "Completa", gestor: "Carlos Spezin", competencias: { estrategico: 4, execucao: 5, inovacao: 4, conexao: 3 } },
  { name: "Eduardo Paulino", role: "Coord. CX", dept: "CX", model: "360°", status: "Em andamento", gestor: "Vanessa Lopes", competencias: { estrategico: 3, execucao: 4, inovacao: 3, conexao: 4 } },
  { name: "Thayna Simoes", role: "Coord. CRM", dept: "Marketing", model: "270°", status: "Completa", gestor: "Felipe Yani", competencias: { estrategico: 4, execucao: 4, inovacao: 5, conexao: 4 } },
  { name: "Aline Horie", role: "Ger. Criação e Design", dept: "Marketing", model: "360°", status: "Completa", gestor: "Felipe Yani", competencias: { estrategico: 4, execucao: 5, inovacao: 5, conexao: 4 } },
  { name: "Jullie Costa", role: "Coord. Produto", dept: "Produto", model: "360°", status: "Em andamento", gestor: "Daniel Keichi", competencias: { estrategico: 4, execucao: 3, inovacao: 4, conexao: 5 } },
];

const statusStyle: Record<string, string> = {
  Completa: "bg-success/10 text-success",
  Pendente: "bg-warning/10 text-warning",
  "Em andamento": "bg-info/10 text-info",
};

const scoreColor = (s: number) => s >= 4 ? "text-success font-semibold" : s >= 3 ? "text-warning font-semibold" : s > 0 ? "text-destructive font-semibold" : "text-muted-foreground";

export default function AvaliacaoPage() {
  const [search, setSearch] = useState("");
  const filtered = evaluations.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Avaliação de Desempenho" subtitle="Ciclo de Avaliação de Potencial 2026">
        <Button size="sm" className="gradient-brand text-primary-foreground border-0 text-[13px]">
          Nova Avaliação
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Total" value={247} icon={ClipboardCheck} variant="purple" />
        <StatCard title="Completas" value="82%" icon={BarChart2} variant="green" trend={{ value: "+12%", positive: true }} />
        <StatCard title="Gestores" value={30} icon={Users} variant="blue" />
        <StatCard title="Modelos" value="3" subtitle="180° / 270° / 360°" icon={Grid3X3} variant="orange" />
      </div>

      {/* Competências */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Médias por Competência</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Foco Estratégico e Analítico", avg: 3.9, color: "bg-primary" },
            { name: "Execução Ágil", avg: 4.1, color: "bg-fluency-green" },
            { name: "Inovação", avg: 3.7, color: "bg-fluency-blue" },
            { name: "Conexão e Desenvolvimento", avg: 3.8, color: "bg-fluency-pink" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[12px] text-muted-foreground mb-1">{c.name}</p>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className={`h-1.5 rounded-full ${c.color}`} style={{ width: `${(c.avg / 5) * 100}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground w-8 text-right">{c.avg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador ou área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[13px]"
          />
        </div>
        <Button variant="outline" size="sm" className="h-8 text-[13px]">
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filtros
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Colaborador</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Área</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Gestor</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Modelo</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Estrat.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Exec.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Inov.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Conex.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground">{e.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{e.dept}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{e.gestor}</td>
                  <td className="px-3 py-2.5 text-center">
                    <Badge variant="secondary" className="text-[11px] font-normal">{e.model}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle[e.status]}`}>{e.status}</span>
                  </td>
                  {[e.competencias.estrategico, e.competencias.execucao, e.competencias.inovacao, e.competencias.conexao].map((s, j) => (
                    <td key={j} className={`px-3 py-2.5 text-center ${scoreColor(s)}`}>{s > 0 ? s : "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
