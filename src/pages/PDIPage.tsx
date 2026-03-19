import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Target, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const pdis = [
  { name: "Aimee Nascimento", competencia: "Foco Estratégico e Analítico", plano: "Aprimorar análise de dados", acoes: ["Dashboard para reunião mensal", "Shadowing com referência", "Curso Power BI"], progresso: 45, prazo: "Jun/2026", status: "Em dia" },
  { name: "Bruna Gavazzoni", competencia: "Inovação", plano: "Desenvolver pensamento criativo", acoes: ["Workshop Design Thinking", "Projeto piloto inovação", "Mentoria externa"], progresso: 30, prazo: "Jul/2026", status: "Em dia" },
  { name: "Lucas Silveira", competencia: "Conexão e Desenvolvimento", plano: "Fortalecer comunicação", acoes: ["Treinamento comunicação assertiva", "Liderar retrospectiva quinzenal"], progresso: 10, prazo: "Mai/2026", status: "Atrasado" },
  { name: "Ana Paula Ferreira", competencia: "Execução Ágil", plano: "Melhorar gestão de tempo", acoes: ["Implementar método GTD", "Check-in semanal com gestor"], progresso: 70, prazo: "Abr/2026", status: "Em dia" },
  { name: "Eduardo Paulino", competencia: "Foco Estratégico e Analítico", plano: "Storytelling de dados", acoes: ["Curso storytelling", "Apresentar em All Hands", "Mentoria com CMO"], progresso: 55, prazo: "Jun/2026", status: "Em dia" },
];

export default function PDIPage() {
  return (
    <>
      <PageHeader title="PDI — Plano de Desenvolvimento Individual" subtitle="Acompanhamento dos planos de ação por competência — modelo 70-20-10">
        <Button className="gradient-brand text-primary-foreground border-0">Novo PDI</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="PDIs Ativos" value={156} icon={Target} variant="purple" />
        <StatCard title="Em Dia" value="78%" icon={CheckCircle2} variant="green" />
        <StatCard title="Atrasados" value={18} icon={AlertTriangle} variant="orange" />
        <StatCard title="Próximo Check-in" value="D+30" subtitle="22/04/2026" icon={Clock} variant="blue" />
      </div>

      {/* 70-20-10 */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Modelo 70-20-10</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { pct: "70%", title: "Experiências Práticas", desc: "Projetos, desafios, entregas reais", color: "bg-primary" },
            { pct: "20%", title: "Aprendizado Social", desc: "Shadowing, mentoria, feedback", color: "bg-fluency-blue" },
            { pct: "10%", title: "Educação Formal", desc: "Cursos, treinamentos, certificações", color: "bg-fluency-green" },
          ].map((m, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className={`text-3xl font-extrabold text-gradient-brand mb-1`}>{m.pct}</div>
              <div className="text-sm font-semibold text-foreground">{m.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* PDI Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {pdis.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                <p className="text-xs text-primary font-medium">{p.competencia}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                p.status === "Em dia" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              }`}>
                {p.status}
              </span>
            </div>
            <p className="text-sm text-foreground font-medium mb-2">{p.plano}</p>
            <div className="space-y-1 mb-3">
              {p.acoes.map((a, j) => (
                <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {a}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Progress value={p.progresso} className="flex-1 h-2" />
              <span className="text-xs font-semibold text-foreground">{p.progresso}%</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Prazo: {p.prazo}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}
