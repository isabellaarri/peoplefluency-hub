import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { Users, ClipboardCheck, Target, Heart, PackageCheck, RefreshCw, ChevronRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { oneOnOneStore, feedbackStore, pdiStore, sentimentStore, deliveryStore } from "@/lib/dataStore";
import { sampleResponses, sampleCollaborators } from "@/data/evaluationData";

export default function DashboardPage() {
  const { user, isAdmin, isLeader, getTeamMembers, allUsers } = useAuth();

  const teamMembers = isAdmin ? allUsers : isLeader ? getTeamMembers() : [user!].filter(Boolean);
  const teamIds = teamMembers.map(m => m.id);

  const myOneOnOnes = isAdmin ? oneOnOneStore.getAll() : oneOnOneStore.getByUser(user?.id || "");
  const myFeedbacks = isAdmin ? feedbackStore.getAll() : feedbackStore.getReceived(user?.id || "");
  const myPdis = isAdmin ? pdiStore.getAll() : pdiStore.getByUser(user?.id || "");
  const mySentiments = isAdmin ? sentimentStore.getAll() : sentimentStore.getByUser(user?.id || "");

  const modules = [
    { title: "Avaliação de Desempenho", desc: "Ciclo 2026", icon: ClipboardCheck, url: "/avaliacao", stat: `${sampleResponses.length} respostas`, color: "text-primary" },
    { title: "1:1 — Devolutivas", desc: "Reuniões e feedback SCCS", icon: Users, url: "/one-on-one", stat: `${myOneOnOnes.length} reuniões`, color: "text-blue-500" },
    { title: "PDI", desc: "Planos de Desenvolvimento", icon: Target, url: "/pdi", stat: `${myPdis.length} ativos`, color: "text-green-500" },
    { title: "Sentimentos", desc: "Pulse check contínuo", icon: Heart, url: "/sentimentos", stat: `${mySentiments.length} registros`, color: "text-pink-500" },
    { title: "Entregas Semanais", desc: "Vinculadas aos valores", icon: PackageCheck, url: "/entregas", stat: `${deliveryStore.getAll().length} entregas`, color: "text-orange-500" },
    { title: "Loop de Valor", desc: "5 etapas do ciclo", icon: RefreshCw, url: "/loop-valor", stat: "Ver detalhes", color: "text-primary" },
  ];

  const unreadFeedbacks = feedbackStore.getReceived(user?.id || "").filter(f => !f.read).length;

  return (
    <>
      <PageHeader title={`Olá, ${user?.name.split(" ")[0]}`} subtitle={isAdmin ? "Visão administrativa completa" : isLeader ? `Líder · ${teamMembers.length} liderados` : user?.cargo || ""}>
        {isAdmin && <Badge className="gradient-brand text-white border-0 gap-1"><Shield className="h-3 w-3" /> Admin</Badge>}
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title={isAdmin ? "Colaboradores" : "Equipe"} value={teamMembers.length} subtitle={isAdmin ? "Total na base" : "liderados"} icon={Users} variant="purple" />
        <StatCard title="1:1 Realizadas" value={myOneOnOnes.length} icon={ClipboardCheck} variant="blue" />
        <StatCard title="PDIs" value={myPdis.length} icon={Target} variant="green" />
        <StatCard title="Feedbacks" value={myFeedbacks.length} subtitle={unreadFeedbacks > 0 ? `${unreadFeedbacks} não lido(s)` : ""} icon={Heart} variant="pink" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-sm font-semibold text-foreground mb-3">Módulos</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {modules.map((m) => (
              <Link key={m.url} to={m.url}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-sm">
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

        <div>
          {unreadFeedbacks > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-4">
              <p className="text-[13px] font-medium text-foreground">📬 {unreadFeedbacks} feedback(s) não lido(s)</p>
              <Link to="/one-on-one" className="text-[12px] text-primary hover:underline">Ver feedbacks →</Link>
            </div>
          )}

          {isLeader && (
            <>
              <h2 className="text-sm font-semibold text-foreground mb-3">Minha Equipe</h2>
              <div className="space-y-1.5 mb-6">
                {getTeamMembers().filter(m => m.id !== user?.id).slice(0, 6).map(member => (
                  <Link key={member.id} to={`/perfil/${member.id}`}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-foreground truncate font-medium">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{member.cargo}</p>
                    </div>
                  </Link>
                ))}
                {getTeamMembers().length > 7 && (
                  <Link to="/equipe" className="text-[12px] text-primary hover:underline pl-10">Ver todos →</Link>
                )}
              </div>
            </>
          )}

          <h2 className="text-sm font-semibold text-foreground mb-3">Valores Fluency</h2>
          <div className="rounded-lg gradient-brand p-4">
            <div className="flex flex-wrap gap-1.5">
              {["Satisfação do Cliente em Primeiro Lugar", "Segurança é Inegociável", "Inovar com Simplicidade",
                "Se Apaixonar Pelo Problema", "Gerar Valor Para o Nosso Ecossistema", "Desafio é a Nossa Diversão",
              ].map((v, i) => (
                <span key={i} className="rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
