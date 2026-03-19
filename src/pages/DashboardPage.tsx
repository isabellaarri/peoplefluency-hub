import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, ClipboardCheck, Target, Heart, PackageCheck, RefreshCw, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const modules = [
  { title: "Avaliação de Desempenho", desc: "Ciclo de Avaliação de Potencial 2026", icon: ClipboardCheck, url: "/avaliacao", stat: "82% completas", color: "text-primary" },
  { title: "1:1 — Devolutivas", desc: "Registros de conversas e feedback SCCS", icon: Users, url: "/one-on-one", stat: "45 realizadas", color: "text-fluency-blue" },
  { title: "PDI", desc: "Planos de Desenvolvimento Individual", icon: Target, url: "/pdi", stat: "156 ativos", color: "text-fluency-green" },
  { title: "Sentimentos", desc: "Pulse check contínuo da equipe", icon: Heart, url: "/sentimentos", stat: "4.2 média", color: "text-fluency-pink" },
  { title: "Entregas Semanais", desc: "Entregas vinculadas aos valores", icon: PackageCheck, url: "/entregas", stat: "42 esta semana", color: "text-fluency-orange" },
  { title: "Loop de Valor", desc: "5 etapas do ciclo de valor Fluency", icon: RefreshCw, url: "/loop-valor", stat: "4.0 score", color: "text-primary" },
];

const pendingItems = [
  { text: "5 devolutivas de avaliação pendentes", due: "Prazo: 27/03", priority: "high" },
  { text: "3 PDIs sem atualização há +30 dias", due: "Revisar até 15/04", priority: "medium" },
  { text: "Reunião People Planning Q2", due: "Agendada 15/04", priority: "low" },
  { text: "Pesquisa de sentimentos — março", due: "Enviar até 21/03", priority: "medium" },
];

const recentActivity = [
  { user: "Ana Vazquez", action: "registrou 1:1 com equipe de Cursos", time: "2h" },
  { user: "Jullie Costa", action: "atualizou PDI — Foco Estratégico", time: "3h" },
  { user: "Carlos Spezin", action: "enviou avaliação 360° completa", time: "5h" },
  { user: "Thayna Simoes", action: "registrou sentimento da equipe CRM", time: "1d" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral da gestão de pessoas — Fluency Academy" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Colaboradores" value={247} subtitle="12 áreas" icon={Users} variant="purple" />
        <StatCard title="Avaliações" value="82%" subtitle="203 de 247" icon={ClipboardCheck} variant="blue" trend={{ value: "+12%", positive: true }} />
        <StatCard title="PDIs Ativos" value={156} icon={Target} variant="green" />
        <StatCard title="Sentimento" value="4.2" subtitle="de 5.0" icon={Heart} variant="pink" trend={{ value: "+0.3", positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Modules */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-sm font-semibold text-foreground mb-3">Módulos</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {modules.map((m) => (
              <Link
                key={m.url}
                to={m.url}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <m.icon className={`h-[18px] w-[18px] ${m.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{m.desc}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground">{m.stat}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Pendências</h2>
          <div className="space-y-2">
            {pendingItems.map((p, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-start gap-2">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    p.priority === "high" ? "bg-destructive" : p.priority === "medium" ? "bg-warning" : "bg-fluency-blue"
                  }`} />
                  <div>
                    <p className="text-[13px] text-foreground">{p.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{p.due}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-semibold text-foreground mt-6 mb-3">Atividade Recente</h2>
          <div className="space-y-1">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {a.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-foreground truncate">
                    <span className="font-medium">{a.user}</span> {a.action}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values bar */}
      <div className="mt-6 rounded-lg gradient-brand p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Nossos Valores</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Satisfação do Cliente em Primeiro Lugar",
            "Segurança é Inegociável",
            "Inovar com Simplicidade",
            "Se Apaixonar Pelo Problema",
            "Gerar Valor Para o Nosso Ecossistema",
            "Desafio é a Nossa Diversão",
          ].map((v, i) => (
            <span key={i} className="rounded-md bg-white/15 px-3 py-1.5 text-[12px] font-medium text-white">
              {v}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
