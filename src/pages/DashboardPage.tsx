import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, ClipboardCheck, Target, Heart, PackageCheck, RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const recentActivities = [
  { user: "Ana Vazquez", action: "Registrou 1:1 com equipe de Cursos", time: "2h atrás", type: "1:1" },
  { user: "Jullie Costa", action: "Atualizou PDI — Foco Estratégico", time: "3h atrás", type: "pdi" },
  { user: "Carlos Spezin", action: "Enviou avaliação 360° completa", time: "5h atrás", type: "avaliacao" },
  { user: "Thayna Simoes", action: "Registrou sentimento da equipe CRM", time: "1d atrás", type: "sentimento" },
  { user: "Eduardo Paulino", action: "Entrega semanal — Operação Eficiente", time: "1d atrás", type: "entrega" },
];

const typeColors: Record<string, string> = {
  "1:1": "bg-fluency-blue/15 text-fluency-blue",
  pdi: "bg-fluency-green/15 text-fluency-green",
  avaliacao: "bg-primary/15 text-primary",
  sentimento: "bg-fluency-pink/15 text-fluency-pink",
  entrega: "bg-fluency-orange/15 text-fluency-orange",
};

const pendingActions = [
  { title: "5 devolutivas pendentes", desc: "Avaliação de Potencial — prazo 27/03", priority: "high" },
  { title: "3 PDIs sem atualização", desc: "Última revisão há mais de 30 dias", priority: "medium" },
  { title: "People Planning Q2", desc: "Reunião de alinhamento agendada para 15/04", priority: "low" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da gestão de pessoas — Fluency Academy"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Colaboradores" value={247} subtitle="12 áreas" icon={Users} variant="purple" />
        <StatCard title="Avaliações Completas" value="82%" subtitle="203 de 247" icon={ClipboardCheck} variant="blue" trend={{ value: "+12% vs último ciclo", positive: true }} />
        <StatCard title="PDIs Ativos" value={156} subtitle="63% do time" icon={Target} variant="green" />
        <StatCard title="Sentimento Médio" value="4.2" subtitle="de 5.0" icon={Heart} variant="pink" trend={{ value: "+0.3 vs mês anterior", positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Atividade Recente
          </h2>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
                <div className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${typeColors[a.type]}`}>
                  {a.type === "1:1" ? "1:1" : a.type.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.user}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.action}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-fluency-orange" />
            Ações Pendentes
          </h2>
          <div className="space-y-3">
            {pendingActions.map((a, i) => (
              <div key={i} className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                    a.priority === "high" ? "bg-destructive" : a.priority === "medium" ? "bg-warning" : "bg-fluency-blue"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Loop de Valor Quick View */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35 }}
        className="mt-6 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Loop de Valor — Resumo
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { name: "Fomento a Comunidade", score: 4.1, color: "bg-primary" },
            { name: "Geração de Demanda", score: 3.8, color: "bg-fluency-orange" },
            { name: "Conversão IA + Humano", score: 4.0, color: "bg-fluency-blue" },
            { name: "Entrega de Produto", score: 4.3, color: "bg-fluency-green" },
            { name: "Operação Escalável", score: 3.9, color: "bg-fluency-pink" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-lg bg-muted/30">
              <div className={`mx-auto mb-2 h-12 w-12 rounded-full ${item.color}/15 flex items-center justify-center`}>
                <span className="text-lg font-bold text-foreground">{item.score}</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-tight">{item.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Valores */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.35 }}
        className="mt-6 rounded-xl gradient-brand p-6 text-primary-foreground"
      >
        <h2 className="text-lg font-semibold mb-3">Nossos Valores</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Satisfação do Cliente em Primeiro Lugar",
            "Segurança é Inegociável",
            "Inovar com Simplicidade",
            "Se Apaixonar Pelo Problema",
            "Gerar Valor Para o Nosso Ecossistema",
            "Desafio é a Nossa Diversão",
          ].map((v, i) => (
            <div key={i} className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 text-sm font-medium">
              {v}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
