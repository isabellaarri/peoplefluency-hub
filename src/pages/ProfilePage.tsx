import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { feedbackStore, oneOnOneStore, pdiStore, sentimentStore } from "@/lib/dataStore";
import { sampleResponses } from "@/data/evaluationData";
import { User, Mail, Building, Calendar, Briefcase, Star } from "lucide-react";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user, allUsers, isAdmin } = useAuth();
  const [tab, setTab] = useState("resumo");

  const profileUser = userId ? allUsers.find(u => u.id === userId) : user;
  if (!profileUser) return <div className="text-center py-12 text-muted-foreground">Usuário não encontrado</div>;

  const canView = isAdmin || profileUser.id === user?.id || profileUser.gestorAtual === user?.name;
  if (!canView) return <div className="text-center py-12 text-muted-foreground">Sem permissão para visualizar este perfil</div>;

  const feedbacksReceived = feedbackStore.getReceived(profileUser.id);
  const oneOnOnes = oneOnOneStore.getByUser(profileUser.id);
  const pdis = pdiStore.getByUser(profileUser.id);
  const sentiments = sentimentStore.getByUser(profileUser.id);
  const evaluations = sampleResponses.filter(r => r.evaluatedName === profileUser.name);

  const roleLabel = profileUser.role === "admin" ? "Admin" : profileUser.role === "leader" ? "Líder" : "Colaborador";

  return (
    <>
      <PageHeader title="Perfil do Colaborador" subtitle={profileUser.name} />

      {/* Profile header card */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-brand text-xl font-bold text-white">
            {profileUser.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-foreground">{profileUser.name}</h2>
              <Badge variant="outline" className="text-[10px]">{roleLabel}</Badge>
              <Badge variant="secondary" className="text-[10px]">{profileUser.model}°</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{profileUser.cargo}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{profileUser.email}</span>
              <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />{profileUser.departamento} · {profileUser.time}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{profileUser.vinculo}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{profileUser.dataAdmissao}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />Gestor: {profileUser.gestorAtual}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatMini label="Avaliações" value={evaluations.length} />
        <StatMini label="1:1s" value={oneOnOnes.length} />
        <StatMini label="Feedbacks" value={feedbacksReceived.length} />
        <StatMini label="PDIs" value={pdis.length} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 bg-muted/50 p-0.5">
          <TabsTrigger value="resumo" className="text-[13px]">Resumo</TabsTrigger>
          <TabsTrigger value="avaliacoes" className="text-[13px]">Avaliações ({evaluations.length})</TabsTrigger>
          <TabsTrigger value="feedbacks" className="text-[13px]">Feedbacks ({feedbacksReceived.length})</TabsTrigger>
          <TabsTrigger value="historico" className="text-[13px]">1:1s ({oneOnOnes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <div className="text-sm text-muted-foreground">
            {evaluations.length === 0 && feedbacksReceived.length === 0 && oneOnOnes.length === 0
              ? "Nenhuma atividade registrada ainda. Comece registrando uma 1:1 ou enviando um feedback."
              : (
                <div className="space-y-4">
                  {evaluations.length > 0 && (
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="text-[13px] font-semibold text-foreground mb-2">Última Avaliação</h3>
                      <p className="text-[12px]">Tipo: {evaluations[0].type} · Modelo: {evaluations[0].model}°</p>
                      {evaluations[0].mandaBem && <p className="text-[12px] mt-1"><strong>Manda bem:</strong> {evaluations[0].mandaBem}</p>}
                    </div>
                  )}
                  {sentiments.length > 0 && (
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="text-[13px] font-semibold text-foreground mb-2">Último Sentimento</h3>
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= sentiments[sentiments.length-1].score ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />)}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="avaliacoes">
          {evaluations.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Sem avaliações</p> : (
            <div className="space-y-2">
              {evaluations.map(ev => (
                <div key={ev.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-medium">{ev.evaluatorName} → {ev.evaluatedName}</p>
                    <Badge variant="outline" className="text-[10px]">{ev.type}</Badge>
                  </div>
                  {ev.mandaBem && <p className="text-[12px] text-muted-foreground"><strong>Manda bem:</strong> {ev.mandaBem}</p>}
                  {ev.podeMelhorar && <p className="text-[12px] text-muted-foreground mt-1"><strong>Pode melhorar:</strong> {ev.podeMelhorar}</p>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="feedbacks">
          {feedbacksReceived.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Sem feedbacks</p> : (
            <div className="space-y-2">
              {feedbacksReceived.map(fb => (
                <div key={fb.id} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-[13px] font-medium mb-1">De: {fb.fromName}</p>
                  {fb.situation && <p className="text-[12px] text-muted-foreground"><strong>S:</strong> {fb.situation}</p>}
                  {fb.suggestion && <p className="text-[12px] text-muted-foreground"><strong>Sugestão:</strong> {fb.suggestion}</p>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico">
          {oneOnOnes.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Sem 1:1s registradas</p> : (
            <div className="space-y-2">
              {oneOnOnes.map(oo => (
                <div key={oo.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex justify-between">
                    <p className="text-[13px] font-medium">{oo.leaderName} ↔ {oo.collaboratorName}</p>
                    <span className="text-[11px] text-muted-foreground">{new Date(oo.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {oo.notes && <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">{oo.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

function StatMini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
