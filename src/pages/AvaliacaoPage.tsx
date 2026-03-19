import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ClipboardCheck, Users, BarChart2, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const evaluations = [
  { name: "Aimee Nascimento", role: "Coord. Experiência Educacional", model: "360°", status: "Completa", competencias: { estrategico: 4, execucao: 4, inovacao: 3, conexao: 4 } },
  { name: "Carlos Spezin", role: "Gerente Revenue", model: "360°", status: "Completa", competencias: { estrategico: 5, execucao: 4, inovacao: 4, conexao: 5 } },
  { name: "Ana Vazquez", role: "Coord. Conteúdo", model: "270°", status: "Pendente", competencias: { estrategico: 0, execucao: 0, inovacao: 0, conexao: 0 } },
  { name: "Bruna Gavazzoni", role: "Gerente B2B", model: "360°", status: "Completa", competencias: { estrategico: 4, execucao: 5, inovacao: 4, conexao: 3 } },
  { name: "Eduardo Paulino", role: "Coord. CX", model: "360°", status: "Em andamento", competencias: { estrategico: 3, execucao: 4, inovacao: 3, conexao: 4 } },
  { name: "Thayna Simoes", role: "Coord. CRM", model: "270°", status: "Completa", competencias: { estrategico: 4, execucao: 4, inovacao: 5, conexao: 4 } },
];

const statusColors: Record<string, string> = {
  Completa: "bg-success/15 text-success border-success/20",
  Pendente: "bg-warning/15 text-warning border-warning/20",
  "Em andamento": "bg-info/15 text-info border-info/20",
};

export default function AvaliacaoPage() {
  return (
    <>
      <PageHeader title="Avaliação de Desempenho" subtitle="Ciclo de Avaliação de Potencial 2026 — Competências e Loop de Valor" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Avaliações" value={247} icon={ClipboardCheck} variant="purple" />
        <StatCard title="Completas" value="82%" icon={BarChart2} variant="green" trend={{ value: "+12%", positive: true }} />
        <StatCard title="Gestores Ativos" value={30} icon={Users} variant="blue" />
        <StatCard title="Modelos" value="3" subtitle="180° / 270° / 360°" icon={Grid3X3} variant="orange" />
      </div>

      {/* Competências avaliadas */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Competências Avaliadas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Foco Estratégico e Analítico", avg: 3.9, color: "bg-primary" },
            { name: "Execução Ágil", avg: 4.1, color: "bg-fluency-green" },
            { name: "Inovação", avg: 3.7, color: "bg-fluency-blue" },
            { name: "Conexão e Desenvolvimento", avg: 3.8, color: "bg-fluency-pink" },
          ].map((c, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-muted">
                  <div className={`h-2 rounded-full ${c.color}`} style={{ width: `${(c.avg / 5) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-foreground">{c.avg}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Colaborador</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Cargo</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Modelo</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Estratégico</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Execução</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Inovação</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Conexão</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.role}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="secondary" className="text-xs">{e.model}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
                  {[e.competencias.estrategico, e.competencias.execucao, e.competencias.inovacao, e.competencias.conexao].map((score, j) => (
                    <td key={j} className="px-4 py-3 text-center">
                      {score > 0 ? (
                        <span className={`font-semibold ${score >= 4 ? "text-success" : score >= 3 ? "text-warning" : "text-destructive"}`}>{score}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
