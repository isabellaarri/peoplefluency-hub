import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DoorOpen, Plus, Clock, CheckCircle2, AlertCircle, Send, FileText, Users, BarChart2 } from "lucide-react";
import { toast } from "sonner";

// ── Tipos ──────────────────────────────────────────────────────────────────
type OffboardingStatus =
  | "dados_iniciais"
  | "aguardando_contabilidade"
  | "retorno_contabilidade"
  | "concluido";

interface OffboardingRecord {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  cargo: string;
  departamento: string;
  tipoContrato: "CLT" | "PJ";
  motivoDesligamento: string;
  dataDesligamento: string;
  ultimoDia: string;
  status: OffboardingStatus;
  pesquisaEnviada: boolean;
  pesquisaRespondida: boolean;
  notas: string;
  criadoEm: string;
}

// Simulated store (substituir por dataStore.ts depois)
const STORAGE_KEY = "fluency_offboarding";

function getAll(): OffboardingRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(records: OffboardingRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function create(data: Omit<OffboardingRecord, "id" | "criadoEm">): OffboardingRecord {
  const records = getAll();
  const record: OffboardingRecord = {
    ...data,
    id: Math.random().toString(36).slice(2),
    criadoEm: new Date().toISOString(),
  };
  save([...records, record]);
  return record;
}

function update(id: string, data: Partial<OffboardingRecord>) {
  const records = getAll().map((r) => (r.id === id ? { ...r, ...data } : r));
  save(records);
}

// ── Config de status ───────────────────────────────────────────────────────
const statusConfig: Record<
  OffboardingStatus,
  { label: string; color: string; icon: typeof Clock; step: number }
> = {
  dados_iniciais: {
    label: "Dados iniciais",
    color: "text-fluency-blue bg-fluency-blue/10 border-fluency-blue/20",
    icon: FileText,
    step: 1,
  },
  aguardando_contabilidade: {
    label: "Aguardando contabilidade",
    color: "text-fluency-orange bg-fluency-orange/10 border-fluency-orange/20",
    icon: Clock,
    step: 2,
  },
  retorno_contabilidade: {
    label: "Retorno da contabilidade",
    color: "text-primary bg-primary/10 border-primary/20",
    icon: AlertCircle,
    step: 3,
  },
  concluido: {
    label: "Concluído",
    color: "text-fluency-green bg-fluency-green/10 border-fluency-green/20",
    icon: CheckCircle2,
    step: 4,
  },
};

const statusOrder: OffboardingStatus[] = [
  "dados_iniciais",
  "aguardando_contabilidade",
  "retorno_contabilidade",
  "concluido",
];

const motivosDesligamento = [
  "Pedido de demissão",
  "Demissão sem justa causa",
  "Demissão por justa causa",
  "Término de contrato",
  "Acordo mútuo",
  "Aposentadoria",
  "Falecimento",
  "Outro",
];

// ── Componente principal ───────────────────────────────────────────────────
export default function OffboardingPage() {
  const { user, isAdmin, isLeader, allUsers } = useAuth();
  const [records, setRecords] = useState<OffboardingRecord[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [tab, setTab] = useState("ativos");

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => setRecords(getAll());

  const handleAdvanceStatus = (id: string, current: OffboardingStatus) => {
    const idx = statusOrder.indexOf(current);
    if (idx < statusOrder.length - 1) {
      const next = statusOrder[idx + 1];
      update(id, { status: next });
      refresh();
      toast.success(`Status atualizado para: ${statusConfig[next].label}`);
    }
  };

  const handleSendSurvey = (id: string) => {
    update(id, { pesquisaEnviada: true });
    refresh();
    toast.success("Pesquisa de offboarding enviada para o e-mail pessoal.");
  };

  const ativos = records.filter((r) => r.status !== "concluido");
  const concluidos = records.filter((r) => r.status === "concluido");

  // Métricas simples
  const totalMes = records.filter((r) => {
    const d = new Date(r.criadoEm);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const pesquisasPendentes = records.filter(
    (r) => !r.pesquisaEnviada && r.status !== "concluido"
  ).length;
  const taxaResposta =
    records.filter((r) => r.pesquisaEnviada).length > 0
      ? Math.round(
          (records.filter((r) => r.pesquisaRespondida).length /
            records.filter((r) => r.pesquisaEnviada).length) *
            100
        )
      : 0;

  return (
    <>
      <PageHeader
        title="Offboarding — Separar"
        subtitle="Gestão de desligamentos, etapas e pesquisa de saída"
      >
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gradient-brand text-white border-0 text-[13px] gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Novo desligamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Iniciar processo de desligamento</DialogTitle>
            </DialogHeader>
            <OffboardingForm
              allUsers={allUsers}
              onSave={() => {
                setShowNew(false);
                refresh();
                toast.success("Processo de desligamento iniciado.");
              }}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Em andamento", value: ativos.length, color: "border-fluency-orange", icon: Clock },
          { label: "Este mês", value: totalMes, color: "border-primary", icon: DoorOpen },
          { label: "Pesquisas pendentes", value: pesquisasPendentes, color: "border-fluency-pink", icon: Send },
          { label: "Taxa de resposta", value: `${taxaResposta}%`, color: "border-fluency-green", icon: BarChart2 },
        ].map((m) => (
          <div
            key={m.label}
            className={`relative overflow-hidden rounded-lg border bg-card p-4 ${m.color} border-l-[3px]`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-foreground leading-none">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Stepper visual das etapas */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Fluxo do processo
        </p>
        <div className="flex items-center gap-0">
          {statusOrder.map((s, i) => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] ${cfg.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 text-center leading-tight max-w-[80px]">
                    {cfg.label}
                  </p>
                </div>
                {i < statusOrder.length - 1 && (
                  <div className="h-[1px] w-8 bg-border shrink-0 -mt-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 bg-muted/50 p-0.5">
          <TabsTrigger value="ativos" className="text-[13px] gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Em andamento
            {ativos.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">
                {ativos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="concluidos" className="text-[13px] gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Concluídos
            {concluidos.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">
                {concluidos.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          {ativos.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <DoorOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum processo de desligamento em andamento
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {ativos
                .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
                .map((r) => (
                  <OffboardingCard
                    key={r.id}
                    record={r}
                    onAdvance={() => handleAdvanceStatus(r.id, r.status)}
                    onSendSurvey={() => handleSendSurvey(r.id)}
                    onRefresh={refresh}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="concluidos">
          {concluidos.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum desligamento concluído ainda
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {concluidos.map((r) => (
                <OffboardingCard
                  key={r.id}
                  record={r}
                  onAdvance={() => {}}
                  onSendSurvey={() => {}}
                  onRefresh={refresh}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

// ── Card de desligamento ───────────────────────────────────────────────────
function OffboardingCard({
  record,
  onAdvance,
  onSendSurvey,
  onRefresh,
}: {
  record: OffboardingRecord;
  onAdvance: () => void;
  onSendSurvey: () => void;
  onRefresh: () => void;
}) {
  const cfg = statusConfig[record.status];
  const Icon = cfg.icon;
  const isLast = record.status === "concluido";
  const isCLT = record.tipoContrato === "CLT";

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5"
            style={{
              background:
                "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))",
            }}
          >
            {record.collaboratorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[13px] font-semibold text-foreground">
                {record.collaboratorName}
              </p>
              <Badge
                variant="outline"
                className={`text-[9px] font-bold px-1.5 ${
                  isCLT
                    ? "border-fluency-blue/30 text-fluency-blue"
                    : "border-fluency-orange/30 text-fluency-orange"
                }`}
              >
                {record.tipoContrato}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {record.cargo} · {record.departamento}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Motivo: {record.motivoDesligamento} · Último dia:{" "}
              {new Date(record.ultimoDia).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Status + ações */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge
            variant="outline"
            className={`text-[10px] gap-1 border ${cfg.color}`}
          >
            <Icon className="h-3 w-3" />
            {cfg.label}
          </Badge>

          <div className="flex gap-1.5 flex-wrap justify-end">
            {/* Avançar etapa */}
            {!isLast && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] gap-1"
                onClick={onAdvance}
              >
                Avançar etapa →
              </Button>
            )}

            {/* Enviar pesquisa de offboarding */}
            {!record.pesquisaEnviada && !isLast && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] gap-1 text-primary border-primary/30 hover:bg-primary/10"
                onClick={onSendSurvey}
              >
                <Send className="h-3 w-3" /> Enviar pesquisa
              </Button>
            )}
            {record.pesquisaEnviada && (
              <Badge
                variant="outline"
                className={`text-[10px] h-7 px-2 ${
                  record.pesquisaRespondida
                    ? "text-fluency-green border-fluency-green/30"
                    : "text-muted-foreground"
                }`}
              >
                {record.pesquisaRespondida
                  ? "✓ Pesquisa respondida"
                  : "⏳ Pesquisa enviada"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {record.notas && (
        <p className="text-[11px] text-muted-foreground mt-2 ml-12 italic">
          {record.notas}
        </p>
      )}
    </div>
  );
}

// ── Formulário de novo desligamento ────────────────────────────────────────
function OffboardingForm({
  allUsers,
  onSave,
}: {
  allUsers: any[];
  onSave: () => void;
}) {
  const [collaboratorId, setCollaboratorId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [dataDesligamento, setDataDesligamento] = useState("");
  const [ultimoDia, setUltimoDia] = useState("");
  const [notas, setNotas] = useState("");

  const selected = allUsers.find((u) => u.id === collaboratorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    create({
      collaboratorId: selected.id,
      collaboratorName: selected.name,
      cargo: selected.cargo,
      departamento: selected.departamento,
      tipoContrato: "CLT", // poderia vir do perfil real
      motivoDesligamento: motivo,
      dataDesligamento,
      ultimoDia,
      status: "dados_iniciais",
      pesquisaEnviada: false,
      pesquisaRespondida: false,
      notas,
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Colaborador</Label>
        <Select value={collaboratorId} onValueChange={setCollaboratorId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o colaborador" />
          </SelectTrigger>
          <SelectContent>
            {allUsers.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name} — {u.cargo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[12px]">Motivo do desligamento</Label>
        <Select value={motivo} onValueChange={setMotivo}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o motivo" />
          </SelectTrigger>
          <SelectContent>
            {motivosDesligamento.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Data do desligamento</Label>
          <Input
            type="date"
            value={dataDesligamento}
            onChange={(e) => setDataDesligamento(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Último dia de trabalho</Label>
          <Input
            type="date"
            value={ultimoDia}
            onChange={(e) => setUltimoDia(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[12px]">Observações internas</Label>
        <Textarea
          rows={3}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Informações adicionais para o processo..."
        />
      </div>

      {/* Preview do fluxo */}
      <div className="rounded-lg bg-muted/40 border border-border p-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Etapas que serão seguidas
        </p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {statusOrder.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span
                className={`px-2 py-0.5 rounded font-medium ${
                  i === 0
                    ? "bg-fluency-blue/10 text-fluency-blue"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {statusConfig[s].label}
              </span>
              {i < statusOrder.length - 1 && <span className="opacity-40">→</span>}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Pesquisa de offboarding será enviada para o e-mail pessoal do colaborador.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full gradient-brand text-white border-0"
        disabled={!collaboratorId || !motivo || !dataDesligamento || !ultimoDia}
      >
        Iniciar processo de desligamento
      </Button>
    </form>
  );
}
