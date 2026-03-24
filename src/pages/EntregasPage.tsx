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
import { deliveryStore, type WeeklyDelivery } from "@/lib/dataStore";
import { PackageCheck, Plus } from "lucide-react";
import { toast } from "sonner";

const loopStages = ["Fomento a Comunidade", "Geração de Demanda", "Conversão IA+Humano", "Entrega Encantadora", "Operação Eficiente"];
const fluencyValues = [
  "Satisfação do Cliente em Primeiro Lugar", "Segurança é Inegociável", "Inovar com Simplicidade",
  "Se Apaixonar Pelo Problema", "Gerar Valor Para o Nosso Ecossistema", "Desafio é a Nossa Diversão",
];

export default function EntregasPage() {
  const { user, isAdmin, isLeader, getTeamMembers } = useAuth();
  const [deliveries, setDeliveries] = useState<WeeklyDelivery[]>([]);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { refresh(); }, [user]);

  const refresh = () => {
    if (!user) return;
    if (isAdmin) setDeliveries(deliveryStore.getAll());
    else if (isLeader) {
      const teamIds = getTeamMembers().map(m => m.id);
      setDeliveries(deliveryStore.getAll().filter(d => teamIds.includes(d.userId) || d.userId === user.id));
    } else setDeliveries(deliveryStore.getByUser(user.id));
  };

  return (
    <>
      <PageHeader title="Entregas Semanais" subtitle="Vincule entregas aos valores da Fluency e ao Loop de Valor">
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5"><Plus className="h-3.5 w-3.5" /> Nova Entrega</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Registrar Entrega</DialogTitle></DialogHeader>
            <DeliveryForm user={user!} onSave={() => { setShowNew(false); refresh(); toast.success("Entrega registrada!"); }} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {deliveries.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <PackageCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground mb-4">Nenhuma entrega registrada</p>
          <Button size="sm" onClick={() => setShowNew(true)} className="gradient-brand text-white border-0">Registrar primeira entrega</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {deliveries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(d => (
            <div key={d.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{d.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{d.userName} · Semana de {new Date(d.weekStart).toLocaleDateString("pt-BR")}</p>
                </div>
                <Badge variant={d.status === "entregue" ? "default" : d.status === "em_andamento" ? "secondary" : "outline"} className="text-[10px]">
                  {d.status === "entregue" ? "Entregue" : d.status === "em_andamento" ? "Em andamento" : "Pendente"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className="text-[10px] bg-primary/5">{d.loopValorStage}</Badge>
                <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700">{d.fluencyValue}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function DeliveryForm({ user, onSave }: { user: any; onSave: () => void }) {
  const [description, setDescription] = useState("");
  const [weekStart, setWeekStart] = useState(new Date().toISOString().split("T")[0]);
  const [loopStage, setLoopStage] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"entregue" | "em_andamento" | "pendente">("entregue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deliveryStore.create({
      userId: user.id,
      userName: user.name,
      weekStart,
      description,
      loopValorStage: loopStage,
      fluencyValue: value,
      status,
      createdAt: new Date().toISOString(),
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Descrição da entrega</Label>
        <Textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="O que foi entregue?" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Semana</Label>
          <Input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Status</Label>
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Etapa do Loop de Valor</Label>
        <Select value={loopStage} onValueChange={setLoopStage}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{loopStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Valor da Fluency</Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>{fluencyValues.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={!description || !loopStage || !value}>Registrar Entrega</Button>
    </form>
  );
}
