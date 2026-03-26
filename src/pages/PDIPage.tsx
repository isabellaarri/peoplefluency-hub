import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { pdiStore, type PDIRecord } from "@/lib/dataStore";
import { Target, Plus, CheckCircle2, Clock, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const typeConfig = {
  "70": {
    label: "Experiência",
    desc: "Aprender fazendo",
    bg: "bg-fluency-blue/10 border-fluency-blue/20",
    badgeBg: "bg-fluency-blue/10 text-fluency-blue",
    bar: "bg-fluency-blue",
  },
  "20": {
    label: "Relações",
    desc: "Mentorias e trocas",
    bg: "bg-fluency-green/10 border-fluency-green/20",
    badgeBg: "bg-fluency-green/10 text-fluency-green",
    bar: "bg-fluency-green",
  },
  "10": {
    label: "Educação",
    desc: "Cursos e formações",
    bg: "bg-primary/10 border-primary/20",
    badgeBg: "bg-primary/10 text-primary",
    bar: "bg-primary",
  },
};

export default function PDIPage() {
  const { user, isAdmin, isLeader, getTeamMembers } = useAuth();
  const [pdis, setPdis] = useState<PDIRecord[]>([]);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { refresh(); }, [user]);

  const refresh = () => {
    if (!user) return;
    if (isAdmin) setPdis(pdiStore.getAll());
    else if (isLeader) {
      const teamIds = getTeamMembers().map((m) => m.id);
      setPdis(pdiStore.getAll().filter((p) => teamIds.includes(p.userId) || p.userId === user.id));
    } else setPdis(pdiStore.getByUser(user.id));
  };

  const statusIcon = (s: string) => {
    if (s === "concluido") return <CheckCircle2 className="h-4 w-4 text-fluency-green" />;
    if (s === "atrasado") return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (s === "em_andamento") return <Clock className="h-4 w-4 text-fluency-orange" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const statusLabel: Record<string, string> = {
    em_andamento: "Em andamento",
    concluido: "Concluído",
    atrasado: "Atrasado",
    nao_iniciado: "Não iniciado",
  };

  const handleDelete = (id: string) => {
    pdiStore.delete(id);
    refresh();
    toast.success("PDI removido");
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    pdiStore.update(id, {
      progress,
      status: progress >= 100 ? "concluido" : "em_andamento",
      updatedAt: new Date().toISOString(),
    });
    refresh();
  };

  return (
    <>
      <PageHeader
        title="PDI — Plano de Desenvolvimento"
        subtitle="Modelo 70-20-10 · Experiência, Relações e Educação"
      >
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Novo PDI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Criar PDI</DialogTitle></DialogHeader>
            <PDIForm
              user={user!}
              onSave={() => { setShowNew(false); refresh(); toast.success("PDI criado!"); }}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["70", "20", "10"] as const).map((type) => {
          const cfg = typeConfig[type];
          const items = pdis.filter((p) => p.type === type);
          const completed = items.filter((p) => p.status === "concluido").length;
          return (
            <div key={type} className={`rounded-lg border p-4 ${cfg.bg}`}>
              <p className="text-[13px] font-semibold text-foreground">
                {type}% — {cfg.label}
              </p>
              <p className="text-[11px] text-muted-foreground">{cfg.desc}</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {completed}/{items.length}
              </p>
            </div>
          );
        })}
      </div>

      {pdis.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Target className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground mb-4">Nenhum PDI cadastrado</p>
          <Button
            size="sm"
            onClick={() => setShowNew(true)}
            className="gradient-brand text-white border-0"
          >
            Criar primeiro PDI
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {pdis
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((pdi) => {
              const cfg = typeConfig[pdi.type];
              return (
                <div
                  key={pdi.id}
                  className="rounded-lg border border-border bg-card p-4 card-accent-left"
                  style={{
                    borderLeftColor: `hsl(var(--fluency-${pdi.type === "70" ? "blue" : pdi.type === "20" ? "green" : "purple"}))`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {statusIcon(pdi.status)}
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{pdi.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {pdi.userName} · {pdi.competency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] border-0 ${cfg.badgeBg}`}>
                        {pdi.type}% — {cfg.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {statusLabel[pdi.status] || pdi.status}
                      </Badge>
                      <button
                        onClick={() => handleDelete(pdi.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {pdi.description && (
                    <p className="text-[12px] text-muted-foreground mt-2 ml-7">
                      {pdi.description}
                    </p>
                  )}
                  <div className="mt-3 ml-7 flex items-center gap-3">
                    <Progress value={pdi.progress} className="flex-1 h-2" />
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {pdi.progress}%
                    </span>
                    <div className="flex gap-1">
                      {[0, 25, 50, 75, 100].map((v) => (
                        <button
                          key={v}
                          onClick={() => handleUpdateProgress(pdi.id, v)}
                          className={`h-6 w-8 rounded text-[10px] font-medium transition-colors ${
                            pdi.progress === v
                              ? "gradient-brand text-white"
                              : "border border-border hover:bg-muted"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 ml-7">
                    Prazo: {new Date(pdi.deadline).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

function PDIForm({ user, onSave }: { user: any; onSave: () => void }) {
  const [title, setTitle] = useState("");
  const [competency, setCompetency] = useState("");
  const [type, setType] = useState<"70" | "20" | "10">("70");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const competencies = [
    "Foco Estratégico e Analítico",
    "Execução Ágil",
    "Inovação",
    "Conexão e Desenvolvimento",
    "Liderança",
    "Fomento a Comunidade",
    "Geração de Demanda",
    "Conversão IA+Humano",
    "Entrega Encantadora",
    "Operação Eficiente",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pdiStore.create({
      userId: user.id,
      userName: user.name,
      title,
      competency,
      type,
      description,
      deadline,
      status: "nao_iniciado",
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Título da ação</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Liderar projeto de automação"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Competência</Label>
          <Select value={competency} onValueChange={setCompetency}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {competencies.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Tipo (70-20-10)</Label>
          <Select value={type} onValueChange={(v: any) => setType(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="70">70% — Experiência</SelectItem>
              <SelectItem value="20">20% — Relações</SelectItem>
              <SelectItem value="10">10% — Educação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Descrição</Label>
        <Textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva a ação..."
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Prazo</Label>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full gradient-brand text-white border-0"
        disabled={!title || !competency}
      >
        Criar PDI
      </Button>
    </form>
  );
}
