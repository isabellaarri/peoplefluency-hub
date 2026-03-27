import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, Calendar, MessageSquare, CheckCircle2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { oneOnOneStore } from "@/lib/dataStore";
import { toast } from "sonner";

// ── Tipos de 1:1 conforme briefing ──────────────────────────────────────
const tipos1on1 = [
  "Avaliação de desempenho",
  "Liderança",
  "Performance",
  "Projetos",
  "PDI",
  "Feedback",
  "Tema livre",
];

const duracoes = ["30 min", "45 min", "60 min"];

const recorrencias = [
  "Única",
  "Semanal",
  "Quinzenal",
  "Mensal",
  "Trimestral",
  "Personalizada",
];

// ── Dados mock (substituir por dataStore depois) ─────────────────────────
const oneOnOnes = [
  {
    leader: "Jullie Costa",
    collaborator: "Aimee Nascimento",
    date: "15/03/2026",
    type: "Devolutiva",
    status: "Realizada",
    topics: [
      "Feedback SCCS — Foco Estratégico",
      "Definição de PDI",
      "Carreira e próximos passos",
    ],
  },
  {
    leader: "Carlos Spezin",
    collaborator: "Bruna Gavazzoni",
    date: "14/03/2026",
    type: "Devolutiva",
    status: "Realizada",
    topics: ["Feedback positivo em execução", "PDI focado em inovação"],
  },
  {
    leader: "Thayna Simoes",
    collaborator: "Lucas Silveira",
    date: "18/03/2026",
    type: "Acompanhamento",
    status: "Agendada",
    topics: ["Check-in D+30", "Revisão de metas CRM"],
  },
  {
    leader: "Eduardo Paulino",
    collaborator: "Gisele Monteiro",
    date: "20/03/2026",
    type: "Devolutiva",
    status: "Agendada",
    topics: ["Avaliação 180°", "Plano de ação CX"],
  },
  {
    leader: "Vanessa Lopes",
    collaborator: "Ana Paula Ferreira",
    date: "13/03/2026",
    type: "Devolutiva",
    status: "Realizada",
    topics: ["Consenso de nota", "Enviado para People"],
  },
  {
    leader: "Aline Horie",
    collaborator: "Adriel Silva",
    date: "19/03/2026",
    type: "Acompanhamento",
    status: "Pendente",
    topics: [],
  },
];

const statusDot: Record<string, string> = {
  Realizada: "bg-success",
  Agendada: "bg-info",
  Pendente: "bg-warning",
};

// ── Formulário de nova 1:1 ───────────────────────────────────────────────
function Nova1on1Form({ onSave }: { onSave: () => void }) {
  const { user, allUsers, isLeader, isAdmin, getTeamMembers } = useAuth();
  const [colaborador, setColaborador] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [duracao, setDuracao] = useState("45 min");
  const [recorrencia, setRecorrencia] = useState("Única");
  const [pauta, setPauta] = useState("");

  // Lista de pessoas disponíveis para a 1:1
  const membros = isAdmin ? allUsers : getTeamMembers();
  const outrosMembros = membros.filter((m) => m.id !== user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colabUser = allUsers.find((u) => u.id === colaborador);
    if (!user || !colabUser) return;

    oneOnOneStore.create({
      date: `${data}T${hora || "09:00"}:00`,
      leaderId: user.id,
      leaderName: user.name,
      collaboratorId: colabUser.id,
      collaboratorName: colabUser.name,
      topics: pauta
        ? pauta.split("\n").map((t) => t.trim()).filter(Boolean)
        : [],
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
      {/* Colaborador */}
      <div className="space-y-1.5">
        <Label className="text-[12px]">Colaborador</Label>
        <Select value={colaborador} onValueChange={setColaborador}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o colaborador" />
          </SelectTrigger>
          <SelectContent>
            {outrosMembros.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} — {m.cargo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tipo */}
      <div className="space-y-1.5">
        <Label className="text-[12px]">Tipo de 1:1</Label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {tipos1on1.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data, Hora e Duração */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Data</Label>
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Hora</Label>
          <Input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Duração</Label>
          <Select value={duracao} onValueChange={setDuracao}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {duracoes.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recorrência */}
      <div className="space-y-1.5">
        <Label className="text-[12px]">Recorrência</Label>
        <Select value={recorrencia} onValueChange={setRecorrencia}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {recorrencias.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pauta */}
      <div className="space-y-1.5">
        <Label className="text-[12px]">
          Pauta prévia{" "}
          <span className="text-muted-foreground font-normal">(opcional — uma por linha)</span>
        </Label>
        <Textarea
          rows={3}
          value={pauta}
          onChange={(e) => setPauta(e.target.value)}
          placeholder={"Feedback sobre entrega da semana\nAlinhamento de PDI\nPróximos passos"}
        />
      </div>

      {/* Google Calendar hint */}
      <div className="rounded-lg bg-muted/40 border border-border p-3 flex items-start gap-2">
        <span className="text-[14px]">📅</span>
        <p className="text-[11px] text-muted-foreground">
          Após criar, você poderá exportar o convite para o <strong>Google Calendar</strong>{" "}
          com data, hora e pauta automaticamente.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full gradient-brand text-white border-0"
        disabled={!colaborador || !tipo || !data}
      >
        Agendar 1:1
      </Button>
    </form>
  );
}

// ── Página principal ─────────────────────────────────────────────────────
export default function OneOnOnePage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = oneOnOnes.filter(
    (o) =>
      o.leader.toLowerCase().includes(search.toLowerCase()) ||
      o.collaborator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="1:1" subtitle="Devolutivas, acompanhamento e feedback SCCS">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gradient-brand text-white border-0 text-[13px] gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Nova 1:1
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agendar nova 1:1</DialogTitle>
            </DialogHeader>
            <Nova1on1Form
              onSave={() => {
                setOpen(false);
                toast.success("1:1 agendada com sucesso!");
              }}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Realizadas" value={45} subtitle="Este ciclo" icon={CheckCircle2} variant="green" />
        <StatCard title="Agendadas" value={12} icon={Calendar} variant="blue" />
        <StatCard title="Pendentes" value={8} icon={Users} variant="orange" />
        <StatCard title="Conclusão" value="69%" icon={MessageSquare} variant="purple" trend={{ value: "+15%", positive: true }} />
      </div>

      {/* SCCS */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h2 className="text-[13px] font-semibold text-foreground mb-3">Modelo SCCS</h2>
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            { l: "S", t: "Situação", d: "Contexto específico", c: "border-l-primary" },
            { l: "C", t: "Comportamento", d: "O que foi observado", c: "border-l-fluency-blue" },
            { l: "C", t: "Consequência", d: "Impacto gerado", c: "border-l-fluency-orange" },
            { l: "S", t: "Solução (PDI)", d: "Caminho de desenvolvimento", c: "border-l-fluency-green" },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-md border border-border border-l-[3px] ${s.c} bg-muted/20 p-3`}
            >
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
        <Input
          placeholder="Buscar por líder ou colaborador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-[13px]"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((o, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))",
                  }}
                >
                  {o.collaborator
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">
                    {o.collaborator}
                  </p>
                  <p className="text-[11px] text-muted-foreground">com {o.leader}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">{o.date}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${statusDot[o.status]}`} />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {o.status}
                  </span>
                </div>
              </div>
            </div>
            {o.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-11">
                <Badge variant="secondary" className="text-[10px]">{o.type}</Badge>
                {o.topics.map((t, j) => (
                  <Badge key={j} variant="outline" className="text-[10px] text-muted-foreground">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-[13px] text-muted-foreground">Nenhuma 1:1 encontrada</p>
          </div>
        )}
      </div>
    </>
  );
}
