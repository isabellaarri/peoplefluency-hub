import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { vacationStore, type VacationRecord } from "@/lib/dataStore";
import { Palmtree, Plus, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: any }> = {
  aprovada: { label: "Aprovada", variant: "default", icon: CheckCircle2 },
  pendente: { label: "Pendente", variant: "secondary", icon: Clock },
  rejeitada: { label: "Rejeitada", variant: "destructive", icon: XCircle },
  em_gozo: { label: "Em gozo", variant: "default", icon: Palmtree },
};

const typeLabels: Record<string, string> = {
  ferias: "Férias",
  recesso: "Recesso",
  day_off: "Day Off",
  licenca: "Licença",
};

export default function FeriasPage() {
  const { user, isAdmin, isLeader, getTeamMembers } = useAuth();
  const [records, setRecords] = useState<VacationRecord[]>([]);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { refresh(); }, [user]);

  const refresh = () => {
    if (!user) return;
    if (isAdmin) setRecords(vacationStore.getAll());
    else if (isLeader) {
      const teamIds = getTeamMembers().map(m => m.id);
      setRecords(vacationStore.getAll().filter(v => teamIds.includes(v.userId) || v.userId === user.id));
    } else setRecords(vacationStore.getByUser(user.id));
  };

  const handleApprove = (id: string) => {
    vacationStore.update(id, { status: "aprovada", approvedBy: user?.name || "" });
    refresh();
    toast.success("Solicitação aprovada!");
  };

  const handleReject = (id: string) => {
    vacationStore.update(id, { status: "rejeitada", approvedBy: user?.name || "" });
    refresh();
    toast.success("Solicitação rejeitada.");
  };

  const myRecords = records.filter(r => r.userId === user?.id);
  const teamRecords = records.filter(r => r.userId !== user?.id);
  const pendingCount = teamRecords.filter(r => r.status === "pendente").length;

  return (
    <>
      <PageHeader title="Férias e Ausências" subtitle="Controle de férias, recessos e day offs">
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Solicitar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Nova Solicitação</DialogTitle></DialogHeader>
            <VacationForm user={user!} onSave={() => { setShowNew(false); refresh(); toast.success("Solicitação enviada!"); }} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* My vacations */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Minhas Solicitações</h2>
        {myRecords.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center rounded-lg border border-dashed border-border">
            <Palmtree className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-[13px] text-muted-foreground">Nenhuma solicitação registrada</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myRecords.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(r => (
              <VacationCard key={r.id} record={r} showActions={false} />
            ))}
          </div>
        )}
      </div>

      {/* Team vacations (leader/admin) */}
      {(isLeader || isAdmin) && teamRecords.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Equipe {pendingCount > 0 && <Badge variant="secondary" className="ml-2 text-[10px]">{pendingCount} pendente(s)</Badge>}
          </h2>
          <div className="space-y-2">
            {teamRecords.sort((a, b) => {
              if (a.status === "pendente" && b.status !== "pendente") return -1;
              if (a.status !== "pendente" && b.status === "pendente") return 1;
              return b.createdAt.localeCompare(a.createdAt);
            }).map(r => (
              <VacationCard key={r.id} record={r} showActions={r.status === "pendente"} onApprove={() => handleApprove(r.id)} onReject={() => handleReject(r.id)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function VacationCard({ record, showActions, onApprove, onReject }: { record: VacationRecord; showActions: boolean; onApprove?: () => void; onReject?: () => void }) {
  const cfg = statusConfig[record.status];
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-foreground">{record.userName}</p>
            <p className="text-[11px] text-muted-foreground">
              {typeLabels[record.type]} · {new Date(record.startDate).toLocaleDateString("pt-BR")} a {new Date(record.endDate).toLocaleDateString("pt-BR")} · {record.days} dia(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={cfg.variant} className="text-[10px] gap-1">
            {cfg.label}
          </Badge>
          {showActions && (
            <div className="flex gap-1 ml-2">
              <Button size="sm" variant="outline" className="h-7 text-[11px] text-success border-success/30 hover:bg-success/10" onClick={onApprove}>Aprovar</Button>
              <Button size="sm" variant="outline" className="h-7 text-[11px] text-destructive border-destructive/30 hover:bg-destructive/10" onClick={onReject}>Rejeitar</Button>
            </div>
          )}
        </div>
      </div>
      {record.notes && <p className="text-[12px] text-muted-foreground mt-2 ml-12">{record.notes}</p>}
    </div>
  );
}

function VacationForm({ user, onSave }: { user: any; onSave: () => void }) {
  const [type, setType] = useState<"ferias" | "recesso" | "day_off" | "licenca">("ferias");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    vacationStore.create({
      userId: user.id,
      userName: user.name,
      type,
      startDate,
      endDate,
      days,
      status: "pendente",
      notes,
      approvedBy: "",
      createdAt: new Date().toISOString(),
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Tipo</Label>
        <Select value={type} onValueChange={(v: any) => setType(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ferias">Férias</SelectItem>
            <SelectItem value="recesso">Recesso</SelectItem>
            <SelectItem value="day_off">Day Off</SelectItem>
            <SelectItem value="licenca">Licença</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Início</Label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Fim</Label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </div>
      </div>
      {days > 0 && <p className="text-[12px] text-muted-foreground">{days} dia(s) solicitado(s)</p>}
      <div className="space-y-1.5">
        <Label className="text-[12px]">Observações</Label>
        <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Informações adicionais..." />
      </div>
      <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={!startDate || !endDate}>Enviar Solicitação</Button>
    </form>
  );
}
