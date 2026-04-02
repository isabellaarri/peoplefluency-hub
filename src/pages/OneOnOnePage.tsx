import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users, Calendar, MessageSquare, CheckCircle2, Plus, Search,
  Heart, Target, ListTodo, Clock, ChevronRight, Eye, EyeOff,
  Star, AlertTriangle, Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  oneOnOneApi, pdiApi, sentimentApi, priorityApi,
  type OneOnOneRecord, type PDITaskFromOneOnOne,
  oneOnOneStore,
} from "@/lib/api";
import { toast } from "sonner";

const tipos = ["Avaliação de desempenho", "Liderança", "Performance", "Projetos", "PDI", "Feedback", "Tema livre"];
const duracoes = ["30 min", "45 min", "60 min"];
const recorrencias = ["Única", "Semanal", "Quinzenal", "Mensal", "Trimestral"];
const moodEmoji = ["😩", "😔", "😐", "😊", "🤩"];

const statusDot: Record<string, string> = {
  realizada: "bg-fluency-green",
  agendada: "bg-fluency-blue",
  cancelada: "bg-destructive",
};

// ── Formulário de nova 1:1 ────────────────────────────────────
function Nova1on1Form({ onSave }: { onSave: () => void }) {
  const { user, allUsers, getTeamMembers, isAdmin } = useAuth();
  const [colaborador, setColaborador] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("10:00");
  const [duracao, setDuracao] = useState("45 min");
  const [recorrencia, setRecorrencia] = useState("Única");
  const [pauta, setPauta] = useState("");

  // Qualquer pessoa — não só liderados diretos
  const todos = isAdmin ? allUsers : allUsers;
  const opcoes = todos.filter(u => u.id !== user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colabUser = allUsers.find(u => u.id === colaborador);
    if (!user || !colabUser) return;
    oneOnOneStore.create({
      date: `${data}T${hora}:00`,
      leaderId: user.id,
      leaderName: user.name,
      collaboratorId: colabUser.id,
      collaboratorName: colabUser.name,
      topics: pauta ? pauta.split("\n").filter(Boolean) : [],
      notes: "",
      actionItems: [],
      mood: 3,
      status: "agendada",
      createdBy: user.id,
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Participante</Label>
        <Select value={colaborador} onValueChange={setColaborador}>
          <SelectTrigger><SelectValue placeholder="Qualquer colaborador" /></SelectTrigger>
          <SelectContent>
            {opcoes.map(u => (
              <SelectItem key={u.id} value={u.id}>{u.name} — {u.cargo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground">Não precisa ser seu liderado direto</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[12px]">Tipo de 1:1</Label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{tipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Data</Label>
          <Input type="date" value={data} onChange={e => setData(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Hora</Label>
          <Input type="time" value={hora} onChange={e => setHora(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Duração</Label>
          <Select value={duracao} onValueChange={setDuracao}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{duracoes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[12px]">Recorrência</Label>
        <Select value={recorrencia} onValueChange={setRecorrencia}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{recorrencias.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[12px]">Pauta prévia <span className="text-muted-foreground font-normal">(uma por linha)</span></Label>
        <Textarea rows={3} value={pauta} onChange={e => setPauta(e.target.value)}
          placeholder={"Alinhamento de PDI\nFeedback sobre entrega\nPróximos passos"} />
      </div>

      <div className="rounded-lg bg-muted/40 p-3 flex gap-2 text-[11px] text-muted-foreground">
        <span>📅</span>
        <span>Após criar, você poderá exportar o convite para o <strong>Google Calendar</strong> com data, hora e pauta.</span>
      </div>

      <Button type="submit" className="w-full gradient-brand text-white border-0"
        disabled={!colaborador || !tipo || !data}>
        Agendar 1:1
      </Button>
    </form>
  );
}

// ── Tela de condução da reunião (split-screen) ────────────────
function MeetingScreen({ record, onClose }: { record: OneOnOneRecord; onClose: () => void }) {
  const { allUsers } = useAuth();
  const [sharedNotes, setSharedNotes] = useState(record.sharedNotes || "");
  const [privateNotes, setPrivateNotes] = useState(record.privateNotes || "");
  const [newTask, setNewTask] = useState("");
  const [newPdiTask, setNewPdiTask] = useState({ title: "", competency: "", type: "70" as "70"|"20"|"10", deadline: "" });
  const [pdiTasks, setPdiTasks] = useState<PDITaskFromOneOnOne[]>(record.pdiTasks || []);
  const [showPrivate, setShowPrivate] = useState(false);
  const [saved, setSaved] = useState(false);

  const colabUser = allUsers.find(u => u.id === record.collaboratorId);

  // Dados de contexto do colaborador
  const sentiments = sentimentApi.getByUser(record.collaboratorId)
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const pdis = pdiApi.getByUser(record.collaboratorId)
    .filter(p => p.status !== "concluido");
  const currentPriority = priorityApi.getCurrentWeek(record.collaboratorId);

  const handleSave = () => {
    oneOnOneApi.update(record.id, {
      sharedNotes,
      privateNotes,
      pdiTasks,
      status: "realizada",
    });

    // Criar PDI tasks automaticamente
    pdiTasks.filter(t => !t.addedToPdi && colabUser).forEach(task => {
      pdiApi.create({
        userId: record.collaboratorId,
        userName: record.collaboratorName,
        title: task.title,
        competency: task.competency,
        type: task.type,
        description: `Criado via 1:1 com ${record.leaderName} em ${new Date(record.date).toLocaleDateString("pt-BR")}`,
        deadline: task.deadline,
        status: "nao_iniciado",
        progress: 0,
        fromOneOnOneId: record.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    setSaved(true);
    toast.success("1:1 salva! Tarefas de PDI criadas automaticamente.");
    setTimeout(onClose, 1000);
  };

  const addPdiTask = () => {
    if (!newPdiTask.title) return;
    setPdiTasks(prev => [...prev, { ...newPdiTask, addedToPdi: false }]);
    setNewPdiTask({ title: "", competency: "", type: "70", deadline: "" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0"
        style={{ borderTop: "3px solid hsl(var(--primary))" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}>
            {record.collaboratorName.split(" ").map(n => n[0]).slice(0,2).join("")}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground">{record.collaboratorName}</p>
            <p className="text-[11px] text-muted-foreground">{record.type} · {record.duration} · {new Date(record.date).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="gradient-brand text-white border-0 gap-1.5 text-[12px]" onClick={handleSave}>
            <CheckCircle2 className="h-3.5 w-3.5" /> {saved ? "Salvo!" : "Concluir 1:1"}
          </Button>
          <Button size="sm" variant="outline" className="text-[12px]" onClick={onClose}>Voltar</Button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Condutor da reunião */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
          <Tabs defaultValue="notas" className="flex flex-col flex-1 overflow-hidden">
            <TabsList className="shrink-0 mx-4 mt-3 mb-0 bg-muted/50 p-0.5 w-fit">
              <TabsTrigger value="notas" className="text-[12px]">Anotações</TabsTrigger>
              <TabsTrigger value="pauta" className="text-[12px]">Pauta ({record.topics.length})</TabsTrigger>
              <TabsTrigger value="pdi" className="text-[12px] gap-1">
                <Target className="h-3 w-3" /> Tarefas PDI {pdiTasks.length > 0 && <Badge className="h-4 px-1 text-[9px] bg-primary/15 text-primary border-0">{pdiTasks.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notas" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Anotações compartilhadas</Label>
                  <span className="text-[10px] text-muted-foreground">Visível para o colaborador</span>
                </div>
                <Textarea
                  value={sharedNotes}
                  onChange={e => setSharedNotes(e.target.value)}
                  placeholder="Pontos discutidos, acordos, alinhamentos..."
                  className="min-h-[140px] text-[13px]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Anotações privadas</Label>
                  <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPrivate(!showPrivate)}>
                    {showPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showPrivate ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {showPrivate && (
                  <Textarea
                    value={privateNotes}
                    onChange={e => setPrivateNotes(e.target.value)}
                    placeholder="Observações internas — não visível para o colaborador..."
                    className="min-h-[100px] text-[13px] border-dashed"
                  />
                )}
                {!showPrivate && (
                  <div className="rounded-md border border-dashed border-border p-3 text-[12px] text-muted-foreground text-center cursor-pointer hover:bg-muted/30"
                    onClick={() => setShowPrivate(true)}>
                    Clique para ver/editar anotações privadas
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pauta" className="flex-1 overflow-auto p-4 mt-0">
              {record.topics.length === 0 ? (
                <p className="text-[13px] text-muted-foreground text-center py-8">Nenhuma pauta definida</p>
              ) : (
                <div className="space-y-2">
                  {record.topics.map((t, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-md p-2.5 border border-border bg-card">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">{i+1}</div>
                      <p className="text-[13px] text-foreground">{t}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pdi" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
              <p className="text-[12px] text-muted-foreground">Tarefas criadas aqui entram automaticamente no PDI do colaborador ao concluir.</p>

              {/* Nova tarefa PDI */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-primary uppercase tracking-wide">+ Nova tarefa de desenvolvimento</p>
                <Input placeholder="Título da tarefa" value={newPdiTask.title}
                  onChange={e => setNewPdiTask(p => ({ ...p, title: e.target.value }))}
                  className="text-[12px]" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Competência" value={newPdiTask.competency}
                    onChange={e => setNewPdiTask(p => ({ ...p, competency: e.target.value }))}
                    className="text-[12px]" />
                  <Select value={newPdiTask.type} onValueChange={(v: any) => setNewPdiTask(p => ({ ...p, type: v }))}>
                    <SelectTrigger className="text-[12px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70% — Experiência</SelectItem>
                      <SelectItem value="20">20% — Relações</SelectItem>
                      <SelectItem value="10">10% — Educação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input type="date" value={newPdiTask.deadline}
                    onChange={e => setNewPdiTask(p => ({ ...p, deadline: e.target.value }))}
                    className="text-[12px] flex-1" />
                  <Button size="sm" onClick={addPdiTask} className="gradient-brand text-white border-0 text-[12px]"
                    disabled={!newPdiTask.title}>
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de tarefas adicionadas */}
              {pdiTasks.length > 0 && (
                <div className="space-y-1.5">
                  {pdiTasks.map((t, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-md p-2.5 border border-fluency-green/20 bg-fluency-green/5">
                      <Target className="h-3.5 w-3.5 text-fluency-green mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-foreground">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground">{t.competency} · {t.type}% · {t.deadline && new Date(t.deadline).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <button onClick={() => setPdiTasks(p => p.filter((_, j) => j !== i))}
                        className="text-muted-foreground hover:text-destructive text-[12px]">×</button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT — Contexto automático do colaborador */}
        <div className="w-[320px] shrink-0 overflow-auto p-4 space-y-4 bg-muted/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contexto — {record.collaboratorName.split(" ")[0]}</p>

          {/* Sentimentos recentes */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Heart className="h-3.5 w-3.5 text-fluency-pink" />
              <p className="text-[11px] font-semibold text-foreground">Sentimentos recentes</p>
            </div>
            {sentiments.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Nenhum registro</p>
            ) : (
              <div className="flex gap-1.5">
                {sentiments.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5" title={new Date(s.date).toLocaleDateString("pt-BR")}>
                    <span className="text-base">{moodEmoji[s.score-1]}</span>
                    <div className="h-1 w-5 rounded-full" style={{ background: `hsl(${[0,20,40,140,151][s.score-1]}deg 70% 55%)` }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDIs ativos */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Target className="h-3.5 w-3.5 text-fluency-green" />
              <p className="text-[11px] font-semibold text-foreground">PDIs ativos ({pdis.length})</p>
            </div>
            {pdis.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Nenhum PDI ativo</p>
            ) : (
              <div className="space-y-2">
                {pdis.slice(0, 3).map(p => (
                  <div key={p.id}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-foreground truncate">{p.title}</span>
                      <span className="text-muted-foreground shrink-0 ml-1">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prioridades da semana */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <ListTodo className="h-3.5 w-3.5 text-primary" />
              <p className="text-[11px] font-semibold text-foreground">Prioridades da semana</p>
            </div>
            {!currentPriority ? (
              <p className="text-[11px] text-muted-foreground">Não definidas ainda</p>
            ) : (
              <div className="space-y-1">
                {currentPriority.priorities.slice(0, 4).map((p, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                    {p.completed
                      ? <CheckCircle2 className="h-3 w-3 text-fluency-green mt-0.5 shrink-0" />
                      : <div className="h-3 w-3 rounded-full border border-muted-foreground/30 mt-0.5 shrink-0" />}
                    <span className={p.completed ? "line-through text-muted-foreground" : "text-foreground"}>{p.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tarefas atrasadas */}
          {pdis.filter(p => p.status === "atrasado").length > 0 && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <p className="text-[11px] font-semibold text-destructive">PDIs atrasados</p>
              </div>
              {pdis.filter(p => p.status === "atrasado").map(p => (
                <p key={p.id} className="text-[11px] text-muted-foreground truncate">{p.title}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function OneOnOnePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<OneOnOneRecord[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [meeting, setMeeting] = useState<OneOnOneRecord | null>(null);

  useEffect(() => { refresh(); }, [user]);

  const refresh = () => {
    if (!user) return;
    setRecords(oneOnOneApi.getByUser(user.id));
  };

  const filtered = records.filter(r =>
    r.leaderName.toLowerCase().includes(search.toLowerCase()) ||
    r.collaboratorName.toLowerCase().includes(search.toLowerCase())
  );

  const realizadas = records.filter(r => r.status === "realizada").length;
  const agendadas  = records.filter(r => r.status === "agendada").length;
  const pendentes  = records.filter(r => r.status !== "realizada" && r.status !== "cancelada").length;
  const pct = records.length > 0 ? Math.round((realizadas / records.length) * 100) : 0;

  if (meeting) {
    return <MeetingScreen record={meeting} onClose={() => { setMeeting(null); refresh(); }} />;
  }

  return (
    <>
      <PageHeader title="1:1" subtitle="Devolutivas, acompanhamento e feedback SCCS">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Nova 1:1
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Agendar nova 1:1</DialogTitle></DialogHeader>
            <Nova1on1Form onSave={() => { setOpen(false); refresh(); toast.success("1:1 agendada!"); }} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Realizadas" value={realizadas} subtitle="Total" icon={CheckCircle2} variant="green" />
        <StatCard title="Agendadas" value={agendadas} icon={Calendar} variant="blue" />
        <StatCard title="Pendentes" value={pendentes} icon={Users} variant="orange" />
        <StatCard title="Conclusão" value={`${pct}%`} icon={MessageSquare} variant="purple" />
      </div>

      {/* SCCS */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Modelo SCCS</p>
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            { l: "S", t: "Situação", d: "Contexto específico", c: "border-l-primary" },
            { l: "C", t: "Comportamento", d: "O que foi observado", c: "border-l-fluency-blue" },
            { l: "C", t: "Consequência", d: "Impacto gerado", c: "border-l-fluency-orange" },
            { l: "S", t: "Solução (PDI)", d: "Caminho de desenvolvimento", c: "border-l-fluency-green" },
          ].map((s, i) => (
            <div key={i} className={`rounded-md border border-border border-l-[3px] ${s.c} bg-muted/20 p-3`}>
              <p className="text-lg font-bold text-foreground">{s.l}</p>
              <p className="text-[12px] font-semibold text-foreground">{s.t}</p>
              <p className="text-[11px] text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-[13px]" />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-[13px] text-muted-foreground mb-3">Nenhuma 1:1 registrada ainda</p>
            <Button size="sm" className="gradient-brand text-white border-0" onClick={() => setOpen(true)}>
              Agendar primeira 1:1
            </Button>
          </div>
        )}

        {filtered.sort((a, b) => b.date.localeCompare(a.date)).map(r => (
          <div key={r.id}
            className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer"
            onClick={() => r.status === "agendada" && setMeeting(r)}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}>
              {r.collaboratorName.split(" ").map(n => n[0]).slice(0,2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[13px] font-semibold text-foreground">{r.collaboratorName}</p>
                {r.type && <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>}
                {r.pdiTasks?.length > 0 && (
                  <Badge className="text-[9px] bg-fluency-green/10 text-fluency-green border-0 gap-1">
                    <Target className="h-2.5 w-2.5" />{r.pdiTasks.length} PDI
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                com {r.leaderName} · {new Date(r.date).toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" })} · {r.duration}
              </p>
              {r.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {r.topics.slice(0,3).map((t, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] text-muted-foreground">{t}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${statusDot[r.status] || "bg-muted-foreground"}`} />
                <span className="text-[11px] text-muted-foreground capitalize">{r.status}</span>
              </div>
              {r.status === "agendada" && (
                <span className="text-[10px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Iniciar reunião
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
