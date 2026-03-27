import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  feedbackStore, oneOnOneStore, pdiStore, sentimentStore, priorityStore,
} from "@/lib/dataStore";
import { sampleResponses } from "@/data/evaluationData";
import {
  Mail, Building, Calendar, Briefcase, User, Heart, Target,
  MessageSquare, ClipboardCheck, Star, CheckCircle2, Clock,
  AlertTriangle, ChevronRight,
} from "lucide-react";

const moodEmoji = ["😩", "😔", "😐", "😊", "🤩"];

export default function ProfilePage() {
  const { userId } = useParams();
  const { user, allUsers, isAdmin } = useAuth();
  const [tab, setTab] = useState("resumo");

  const profileUser = userId ? allUsers.find((u) => u.id === userId) : user;
  if (!profileUser)
    return <div className="text-center py-12 text-muted-foreground">Usuário não encontrado</div>;

  const canView =
    isAdmin || profileUser.id === user?.id || profileUser.gestorAtual === user?.name;
  if (!canView)
    return (
      <div className="text-center py-12 text-muted-foreground">
        Sem permissão para visualizar este perfil
      </div>
    );

  const feedbacksReceived = feedbackStore.getReceived(profileUser.id);
  const unreadFeedbacks = feedbacksReceived.filter((f) => !f.read).length;
  const oneOnOnes = oneOnOneStore.getByUser(profileUser.id);
  const pdis = pdiStore.getByUser(profileUser.id);
  const pdisActive = pdis.filter((p) => p.status !== "concluido");
  const sentiments = sentimentStore.getByUser(profileUser.id).sort((a, b) => b.date.localeCompare(a.date));
  const evaluations = sampleResponses.filter((r) => r.evaluatedName === profileUser.name);
  const currentPriority = priorityStore.getCurrentWeek(profileUser.id);

  const roleLabel =
    profileUser.role === "admin" ? "Admin" : profileUser.role === "leader" ? "Líder" : "Colaborador";

  const avgSentiment =
    sentiments.length > 0
      ? (sentiments.slice(0, 10).reduce((s, r) => s + r.score, 0) / Math.min(sentiments.length, 10)).toFixed(1)
      : "—";

  const pdiProgress =
    pdis.length > 0
      ? Math.round(pdis.reduce((s, p) => s + p.progress, 0) / pdis.length)
      : 0;

  return (
    <>
      <PageHeader
        title={profileUser.id === user?.id ? "Meu Perfil" : "Perfil do Colaborador"}
        subtitle={profileUser.name}
      />

      {/* Profile hero */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg, hsl(272 96% 19%), hsl(256 74% 59%))",
            }}
          >
            {profileUser.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-lg font-bold text-foreground">{profileUser.name}</h2>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold ${
                  profileUser.role === "admin"
                    ? "border-fluency-orange/40 text-fluency-orange"
                    : profileUser.role === "leader"
                    ? "border-primary/40 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {roleLabel}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {profileUser.model}° modelo
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {profileUser.vinculo}
              </Badge>
            </div>

            <p className="text-[14px] font-medium text-muted-foreground">{profileUser.cargo}</p>
            <p className="text-[12px] text-muted-foreground">{profileUser.clusterCargo}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
              {[
                { icon: Mail, text: profileUser.email },
                { icon: Building, text: `${profileUser.departamento} · ${profileUser.time}` },
                { icon: Briefcase, text: profileUser.centroCusto },
                { icon: Calendar, text: `Admissão: ${profileUser.dataAdmissao}` },
                { icon: User, text: `Gestor: ${profileUser.gestorAtual}` },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Avaliações", value: evaluations.length, icon: ClipboardCheck, color: "text-primary" },
          { label: "1:1s", value: oneOnOnes.length, icon: MessageSquare, color: "text-fluency-blue" },
          { label: "Feedbacks", value: feedbacksReceived.length, icon: Heart, color: "text-fluency-pink", badge: unreadFeedbacks > 0 ? unreadFeedbacks : undefined },
          { label: "PDIs", value: pdis.length, icon: Target, color: "text-fluency-green" },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-[26px] font-bold text-foreground leading-none mt-1">{s.value}</p>
              </div>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            {s.badge && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {s.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-5 bg-muted/50 p-0.5 flex-wrap h-auto">
          <TabsTrigger value="resumo" className="text-[13px]">Resumo</TabsTrigger>
          <TabsTrigger value="pdi" className="text-[13px]">PDI ({pdis.length})</TabsTrigger>
          <TabsTrigger value="avaliacoes" className="text-[13px]">Avaliações ({evaluations.length})</TabsTrigger>
          <TabsTrigger value="feedbacks" className="text-[13px]">Feedbacks ({feedbacksReceived.length})</TabsTrigger>
          <TabsTrigger value="historico" className="text-[13px]">1:1s ({oneOnOnes.length})</TabsTrigger>
          <TabsTrigger value="sentimentos" className="text-[13px]">Sentimentos</TabsTrigger>
        </TabsList>

        {/* ── Resumo ──────────────────────────────────────────────── */}
        <TabsContent value="resumo">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Sentimento médio */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sentimento (últimas 10 semanas)</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{sentiments[0] ? moodEmoji[sentiments[0].score - 1] : "—"}</span>
                <div>
                  <p className="text-[22px] font-bold text-foreground leading-none">{avgSentiment}</p>
                  <p className="text-[11px] text-muted-foreground">média de {Math.min(sentiments.length, 10)} registros</p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {sentiments.slice(0, 10).reverse().map((s, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${s.score * 8}px`,
                      background: `hsl(${[0, 20, 40, 140, 151][s.score - 1]}deg 70% 55%)`,
                      opacity: 0.8,
                    }}
                    title={`${new Date(s.date).toLocaleDateString("pt-BR")}: ${s.score}`}
                  />
                ))}
              </div>
            </div>

            {/* PDI Progress */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Progresso PDI</p>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[22px] font-bold text-foreground leading-none">{pdiProgress}%</p>
                <p className="text-[11px] text-muted-foreground">média de {pdis.length} planos</p>
              </div>
              <Progress value={pdiProgress} className="h-2 mb-3" />
              <div className="space-y-1.5">
                {pdisActive.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-[12px]">
                    {p.status === "concluido" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-fluency-green shrink-0" />
                    ) : p.status === "atrasado" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-fluency-orange shrink-0" />
                    )}
                    <span className="text-foreground truncate flex-1">{p.title}</span>
                    <span className="text-muted-foreground shrink-0">{p.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridades da semana */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Prioridades desta semana</p>
              {currentPriority ? (
                <div className="space-y-2">
                  {currentPriority.priorities.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {p.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-fluency-green mt-0.5 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-[12px] ${p.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {p.text}
                      </span>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {currentPriority.priorities.filter((p) => p.completed).length}/
                    {currentPriority.priorities.length} concluídas
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground">Nenhuma prioridade definida esta semana</p>
              )}
            </div>

            {/* Última avaliação */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Última avaliação</p>
              {evaluations.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{evaluations[0].type}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{evaluations[0].model}°</Badge>
                  </div>
                  {evaluations[0].mandaBem && (
                    <p className="text-[12px] text-foreground">
                      <span className="text-fluency-green font-semibold">✓ Manda bem: </span>
                      {evaluations[0].mandaBem}
                    </p>
                  )}
                  {evaluations[0].podeMelhorar && (
                    <p className="text-[12px] text-foreground">
                      <span className="text-fluency-orange font-semibold">↑ Pode melhorar: </span>
                      {evaluations[0].podeMelhorar}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground">Nenhuma avaliação registrada ainda</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── PDI ─────────────────────────────────────────────────── */}
        <TabsContent value="pdi">
          {pdis.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Target className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-[13px] text-muted-foreground">Nenhum PDI cadastrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pdis.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{p.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{p.competency}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Badge
                        className={`text-[10px] border-0 ${
                          p.type === "70"
                            ? "bg-fluency-blue/10 text-fluency-blue"
                            : p.type === "20"
                            ? "bg-fluency-green/10 text-fluency-green"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {p.type}%
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          p.status === "concluido"
                            ? "text-fluency-green border-fluency-green/30"
                            : p.status === "atrasado"
                            ? "text-destructive border-destructive/30"
                            : "text-muted-foreground"
                        }`}
                      >
                        {p.status === "em_andamento" ? "Em andamento" : p.status === "concluido" ? "Concluído" : p.status === "atrasado" ? "Atrasado" : "Não iniciado"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={p.progress} className="flex-1 h-2" />
                    <span className="text-[12px] font-semibold text-muted-foreground w-10 text-right">{p.progress}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Prazo: {new Date(p.deadline).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Avaliações ──────────────────────────────────────────── */}
        <TabsContent value="avaliacoes">
          {evaluations.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <ClipboardCheck className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-[13px] text-muted-foreground">Sem avaliações registradas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {evaluations.map((ev) => (
                <div key={ev.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-semibold text-foreground">{ev.evaluatorName}</p>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{ev.type}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{ev.model}°</Badge>
                    </div>
                  </div>
                  {ev.mandaBem && (
                    <p className="text-[12px] text-muted-foreground mb-1">
                      <span className="text-fluency-green font-semibold">Manda bem: </span>{ev.mandaBem}
                    </p>
                  )}
                  {ev.podeMelhorar && (
                    <p className="text-[12px] text-muted-foreground">
                      <span className="text-fluency-orange font-semibold">Pode melhorar: </span>{ev.podeMelhorar}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Feedbacks ───────────────────────────────────────────── */}
        <TabsContent value="feedbacks">
          {feedbacksReceived.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Heart className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-[13px] text-muted-foreground">Nenhum feedback recebido ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {feedbacksReceived.map((fb) => (
                <div key={fb.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-semibold text-foreground">De: {fb.fromName}</p>
                    <div className="flex gap-1.5">
                      {!fb.read && (
                        <Badge className="text-[9px] bg-primary/10 text-primary border-0">Novo</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(fb.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[12px]">
                    {fb.situation && <p><span className="font-semibold text-fluency-blue">S — Situação: </span><span className="text-muted-foreground">{fb.situation}</span></p>}
                    {fb.behavior && <p><span className="font-semibold text-primary">C — Comportamento: </span><span className="text-muted-foreground">{fb.behavior}</span></p>}
                    {fb.consequence && <p><span className="font-semibold text-fluency-orange">C — Consequência: </span><span className="text-muted-foreground">{fb.consequence}</span></p>}
                    {fb.suggestion && <p><span className="font-semibold text-fluency-green">S — Sugestão: </span><span className="text-muted-foreground">{fb.suggestion}</span></p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── 1:1s ────────────────────────────────────────────────── */}
        <TabsContent value="historico">
          {oneOnOnes.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-[13px] text-muted-foreground">Nenhuma 1:1 registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {oneOnOnes.sort((a, b) => b.date.localeCompare(a.date)).map((oo) => (
                <div key={oo.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">
                        {oo.leaderName} ↔ {oo.collaboratorName}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(oo.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        oo.status === "realizada"
                          ? "text-fluency-green border-fluency-green/30"
                          : oo.status === "agendada"
                          ? "text-fluency-blue border-fluency-blue/30"
                          : "text-muted-foreground"
                      }`}
                    >
                      {oo.status}
                    </Badge>
                  </div>
                  {oo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {oo.topics.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  )}
                  {oo.notes && (
                    <p className="text-[12px] text-muted-foreground mt-2 italic line-clamp-2">{oo.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Sentimentos ─────────────────────────────────────────── */}
        <TabsContent value="sentimentos">
          {sentiments.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Heart className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-[13px] text-muted-foreground">Nenhum sentimento registrado ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sentiments.slice(0, 20).map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <span className="text-xl">{moodEmoji[s.score - 1]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i <= s.score ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    {s.comment && (
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5 italic">"{s.comment}"</p>
                    )}
                    {s.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {s.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(s.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
