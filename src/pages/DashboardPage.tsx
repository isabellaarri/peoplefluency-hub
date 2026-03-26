import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart, Target, ListTodo, Palmtree, FileQuestion, ClipboardCheck,
  ChevronRight, Shield, MessageSquare, Users, Smile,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  pdiStore, sentimentStore, priorityStore, vacationStore,
  surveyStore, surveyResponseStore, oneOnOneStore, feedbackStore,
} from "@/lib/dataStore";
import { sampleResponses } from "@/data/evaluationData";

export default function DashboardPage() {
  const { user, isAdmin, isLeader, getTeamMembers, allUsers } = useAuth();
  if (!user) return null;

  const isCollaborator = !isLeader && !isAdmin;
  const firstName = user.name.split(" ")[0];

  const myPdis = pdiStore.getByUser(user.id);
  const myPdisActive = myPdis.filter((p) => p.status !== "concluido").length;
  const currentPriority = priorityStore.getCurrentWeek(user.id);
  const priorityProgress = currentPriority
    ? `${currentPriority.priorities.filter((p) => p.completed).length}/${currentPriority.priorities.length}`
    : "—";
  const myVacations = vacationStore.getByUser(user.id);
  const pendingVacations = myVacations.filter((v) => v.status === "pendente").length;
  const activeSurveys = surveyStore.getActive();
  const answeredSurveys = new Set(surveyResponseStore.getByUser(user.id).map((r) => r.surveyId));
  const pendingSurveys = activeSurveys.filter((s) => !answeredSurveys.has(s.id)).length;
  const todaySentiment = sentimentStore
    .getByUser(user.id)
    .find((s) => s.date.startsWith(new Date().toISOString().split("T")[0]));
  const unreadFeedbacks = feedbackStore.getReceived(user.id).filter((f) => !f.read).length;

  const teamMembers = isAdmin ? allUsers : isLeader ? getTeamMembers() : [];

  const collaboratorModules = [
    { title: "Sentimentos", desc: todaySentiment ? "✅ Check-in feito hoje" : "⏳ Pendente hoje", icon: Heart, url: "/sentimentos", accent: "card-accent-pink", highlight: !todaySentiment },
    { title: "Prioridades da Semana", desc: currentPriority ? `${priorityProgress} concluídas` : "Definir prioridades", icon: ListTodo, url: "/prioridades", accent: "card-accent-left", highlight: !currentPriority },
    { title: "PDI", desc: `${myPdisActive} ação(ões) em andamento`, icon: Target, url: "/pdi", accent: "card-accent-green" },
    { title: "Férias e Ausências", desc: pendingVacations > 0 ? `${pendingVacations} pendente(s)` : "Sem pendências", icon: Palmtree, url: "/ferias", accent: "card-accent-blue" },
    { title: "Pesquisas", desc: pendingSurveys > 0 ? `${pendingSurveys} para responder` : "Tudo respondido", icon: FileQuestion, url: "/pesquisas", accent: "card-accent-orange", highlight: pendingSurveys > 0 },
  ];

  const adminModules = [
    { title: "Avaliação de Desempenho", desc: `${sampleResponses.length} respostas no ciclo`, icon: ClipboardCheck, url: "/avaliacao", accent: "card-accent-left" },
    { title: "1:1 — Devolutivas", desc: `${oneOnOneStore.getAll().length} reuniões registradas`, icon: MessageSquare, url: "/one-on-one", accent: "card-accent-blue" },
    { title: "Equipe", desc: `${teamMembers.length} colaboradores`, icon: Users, url: "/equipe", accent: "card-accent-green" },
    { title: "Pesquisas", desc: `${activeSurveys.length} ativa(s)`, icon: FileQuestion, url: "/pesquisas", accent: "card-accent-orange" },
  ];

  return (
    <>
      {/* Hero greeting card */}
      <div
        className="relative overflow-hidden rounded-xl p-6 mb-6 text-white"
        style={{ background: "linear-gradient(135deg, hsl(272 96% 19%) 0%, hsl(256 74% 59%) 70%, hsl(252 100% 73%) 100%)" }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 bg-white" />
        <div className="absolute bottom-0 right-24 w-24 h-24 rounded-full opacity-10"
          style={{ background: "hsl(300 88% 71%)" }} />

        <div className="relative z-10 flex items-end justify-between">
          <div>
            <p className="text-[13px] font-medium text-white/70 mb-1">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl font-bold leading-tight">
              Olá, {firstName}! 👋
            </h1>
            <p className="text-[13px] text-white/70 mt-1">
              {isAdmin ? "Visão administrativa" : isLeader ? `Líder · ${teamMembers.length} liderados` : user.cargo}
            </p>
            {isAdmin && (
              <Badge className="mt-3 bg-white/15 text-white border-0 gap-1 hover:bg-white/20">
                <Shield className="h-3 w-3" /> Admin
              </Badge>
            )}
          </div>
        </div>
      </div>

      {isCollaborator && (!todaySentiment || !currentPriority || pendingSurveys > 0) && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-6">
          <p className="text-[13px] font-semibold text-foreground mb-2">📋 Ações pendentes</p>
          <div className="flex flex-wrap gap-2">
            {!todaySentiment && (
              <Link to="/sentimentos" className="rounded-md border border-primary/20 bg-card px-3 py-1.5 text-[12px] font-medium text-primary hover:bg-primary/10 transition-colors">
                Registrar sentimento do dia
              </Link>
            )}
            {!currentPriority && (
              <Link to="/prioridades" className="rounded-md border border-primary/20 bg-card px-3 py-1.5 text-[12px] font-medium text-primary hover:bg-primary/10 transition-colors">
                Definir prioridades da semana
              </Link>
            )}
            {pendingSurveys > 0 && (
              <Link to="/pesquisas" className="rounded-md border border-primary/20 bg-card px-3 py-1.5 text-[12px] font-medium text-primary hover:bg-primary/10 transition-colors">
                {pendingSurveys} pesquisa(s) para responder
              </Link>
            )}
          </div>
        </div>
      )}

      {isCollaborator ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Sentimento"
            value={todaySentiment ? ["😩", "😔", "😐", "😊", "🤩"][todaySentiment.score - 1] : "—"}
            subtitle={todaySentiment ? "hoje" : "pendente"}
            icon={Smile}
            variant="pink"
          />
          <StatCard title="Prioridades" value={priorityProgress} subtitle="esta semana" icon={ListTodo} variant="purple" />
          <StatCard title="PDIs Ativos" value={myPdisActive} icon={Target} variant="green" />
          <StatCard
            title="Feedbacks"
            value={feedbackStore.getReceived(user.id).length}
            subtitle={unreadFeedbacks > 0 ? `${unreadFeedbacks} novo(s)` : ""}
            icon={Heart}
            variant="blue"
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard title={isAdmin ? "Colaboradores" : "Equipe"} value={teamMembers.length} icon={Users} variant="purple" />
          <StatCard title="1:1 Realizadas" value={oneOnOneStore.getAll().length} icon={ClipboardCheck} variant="blue" />
          <StatCard title="PDIs Ativos" value={pdiStore.getAll().filter((p) => p.status !== "concluido").length} icon={Target} variant="green" />
          <StatCard title="Pesquisas Ativas" value={activeSurveys.length} icon={FileQuestion} variant="orange" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-[13px] font-semibold text-foreground mb-3">
            {isCollaborator ? "Meu Espaço" : "Gestão"}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {(isCollaborator ? collaboratorModules : adminModules).map((m) => (
              <Link
                key={m.url}
                to={m.url}
                className={`group flex items-center gap-3 rounded-lg border bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-sm ${
                  "highlight" in m && m.highlight ? "border-primary/20 bg-primary/5" : "border-border"
                } ${m.accent}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <m.icon className="h-[18px] w-[18px] text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{m.desc}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          {unreadFeedbacks > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-4">
              <p className="text-[13px] font-semibold text-foreground">
                📬 {unreadFeedbacks} feedback(s) não lido(s)
              </p>
              <Link to="/perfil" className="text-[12px] text-primary hover:underline">
                Ver feedbacks →
              </Link>
            </div>
          )}

          {isLeader && (
            <>
              <h2 className="text-[13px] font-semibold text-foreground mb-3">Minha Equipe</h2>
              <div className="space-y-1 mb-6">
                {getTeamMembers()
                  .filter((m) => m.id !== user.id)
                  .slice(0, 6)
                  .map((member) => (
                    <Link
                      key={member.id}
                      to={`/perfil/${member.id}`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}
                      >
                        {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-foreground truncate font-medium">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{member.cargo}</p>
                      </div>
                    </Link>
                  ))}
                {getTeamMembers().length > 7 && (
                  <Link to="/equipe" className="text-[12px] text-primary hover:underline pl-10">
                    Ver todos →
                  </Link>
                )}
              </div>
            </>
          )}

          <h2 className="text-[13px] font-semibold text-foreground mb-3">Acesso Rápido</h2>
          <div className="space-y-1 mb-4">
            <Link to="/politicas" className="flex items-center gap-2 rounded-md p-2 text-[12px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
              📋 Políticas de People
            </Link>
            <Link to="/loop-valor" className="flex items-center gap-2 rounded-md p-2 text-[12px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
              🔄 Loop de Valor
            </Link>
            <Link to="/perfil" className="flex items-center gap-2 rounded-md p-2 text-[12px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
              👤 Meu Perfil
            </Link>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: "linear-gradient(135deg, hsl(272 96% 19%), hsl(256 74% 59%))" }}
          >
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-3">
              Valores Fluency
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Satisfação do Cliente em Primeiro Lugar",
                "Segurança é Inegociável",
                "Inovar com Simplicidade",
                "Se Apaixonar Pelo Problema",
                "Gerar Valor Para o Nosso Ecossistema",
                "Desafio é a Nossa Diversão",
              ].map((v, i) => (
                <span
                  key={i}
                  className="rounded-md px-2.5 py-1 text-[10px] font-medium text-white/80"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
