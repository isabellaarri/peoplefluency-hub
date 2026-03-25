import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { priorityStore, type WeeklyPriority } from "@/lib/dataStore";
import { ListTodo, Plus, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const loopStages = ["Fomento a Comunidade", "Geração de Demanda", "Conversão IA+Humano", "Entrega Encantadora", "Operação Eficiente"];

function getWeekStart() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  return monday.toISOString().split("T")[0];
}

function formatWeek(dateStr: string) {
  const d = new Date(dateStr);
  const end = new Date(d);
  end.setDate(d.getDate() + 4);
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} — ${end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;
}

export default function PrioridadesPage() {
  const { user, isAdmin, isLeader, getTeamMembers } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<WeeklyPriority | null>(null);
  const [allPriorities, setAllPriorities] = useState<WeeklyPriority[]>([]);
  const [editing, setEditing] = useState(false);
  const [newPriorities, setNewPriorities] = useState<{ text: string; loopStage: string; completed: boolean }[]>([
    { text: "", loopStage: "", completed: false },
  ]);
  const [reflection, setReflection] = useState("");

  useEffect(() => { refresh(); }, [user]);

  const refresh = () => {
    if (!user) return;
    const week = priorityStore.getCurrentWeek(user.id);
    setCurrentWeek(week || null);
    if (week) {
      setNewPriorities(week.priorities);
      setReflection(week.reflection);
    }
    if (isAdmin) setAllPriorities(priorityStore.getAll());
    else if (isLeader) {
      const teamIds = getTeamMembers().map(m => m.id);
      setAllPriorities(priorityStore.getAll().filter(p => teamIds.includes(p.userId)));
    } else setAllPriorities(priorityStore.getByUser(user.id));
  };

  const addPriority = () => setNewPriorities(prev => [...prev, { text: "", loopStage: "", completed: false }]);

  const updatePriority = (idx: number, data: Partial<{ text: string; loopStage: string; completed: boolean }>) => {
    setNewPriorities(prev => prev.map((p, i) => i === idx ? { ...p, ...data } : p));
  };

  const removePriority = (idx: number) => {
    if (newPriorities.length > 1) setNewPriorities(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!user) return;
    const weekStart = getWeekStart();
    const filtered = newPriorities.filter(p => p.text.trim());
    if (filtered.length === 0) return;

    if (currentWeek) {
      priorityStore.update(currentWeek.id, { priorities: filtered, reflection });
    } else {
      priorityStore.create({
        userId: user.id,
        userName: user.name,
        weekStart,
        priorities: filtered,
        reflection,
        createdAt: new Date().toISOString(),
      });
    }
    setEditing(false);
    refresh();
    toast.success("Prioridades salvas!");
  };

  const toggleCompleted = (idx: number) => {
    if (!currentWeek) return;
    const updated = [...currentWeek.priorities];
    updated[idx] = { ...updated[idx], completed: !updated[idx].completed };
    priorityStore.update(currentWeek.id, { priorities: updated });
    refresh();
  };

  const weekStart = getWeekStart();
  const completedCount = currentWeek?.priorities.filter(p => p.completed).length || 0;
  const totalCount = currentWeek?.priorities.length || 0;

  return (
    <>
      <PageHeader title="Prioridades da Semana" subtitle={`Semana ${formatWeek(weekStart)} · Alinhadas ao Loop de Valor`}>
        {!editing && (
          <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5" onClick={() => setEditing(true)}>
            {currentWeek ? "Editar" : <><Plus className="h-3.5 w-3.5" /> Definir Prioridades</>}
          </Button>
        )}
      </PageHeader>

      {/* Current week */}
      {editing ? (
        <div className="rounded-lg border border-border bg-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Minhas Prioridades — {formatWeek(weekStart)}</h3>
          <div className="space-y-3">
            {newPriorities.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[12px] font-medium text-muted-foreground mt-2.5 w-5">{i + 1}.</span>
                <div className="flex-1 space-y-1.5">
                  <Input value={p.text} onChange={e => updatePriority(i, { text: e.target.value })} placeholder="O que preciso entregar esta semana?" />
                  <Select value={p.loopStage} onValueChange={v => updatePriority(i, { loopStage: v })}>
                    <SelectTrigger className="h-8 text-[12px]"><SelectValue placeholder="Etapa do Loop" /></SelectTrigger>
                    <SelectContent>{loopStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {newPriorities.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="text-destructive h-8 mt-1" onClick={() => removePriority(i)}>×</Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="text-[12px]" onClick={addPriority}>+ Adicionar prioridade</Button>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label className="text-[12px]">Reflexão da semana (opcional)</Label>
            <Textarea rows={2} value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Como foi a semana? O que aprendi?" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="gradient-brand text-white border-0 flex-1" onClick={handleSave}>Salvar Prioridades</Button>
            <Button variant="outline" onClick={() => { setEditing(false); if (currentWeek) { setNewPriorities(currentWeek.priorities); setReflection(currentWeek.reflection); } }}>Cancelar</Button>
          </div>
        </div>
      ) : currentWeek ? (
        <div className="rounded-lg border border-border bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Minhas Prioridades</h3>
            <Badge variant="outline" className="text-[10px]">{completedCount}/{totalCount} concluídas</Badge>
          </div>
          <div className="space-y-2">
            {currentWeek.priorities.map((p, i) => (
              <div key={i} className="flex items-start gap-3 rounded-md p-2.5 hover:bg-muted/30 transition-colors">
                <Checkbox checked={p.completed} onCheckedChange={() => toggleCompleted(i)} className="mt-0.5" />
                <div className="flex-1">
                  <p className={`text-[13px] ${p.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{p.text}</p>
                  {p.loopStage && (
                    <Badge variant="outline" className="text-[9px] mt-1 gap-1">
                      <RefreshCw className="h-2.5 w-2.5" /> {p.loopStage}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {currentWeek.reflection && (
            <div className="mt-4 rounded-md bg-muted/30 p-3">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Reflexão</p>
              <p className="text-[12px] text-foreground">{currentWeek.reflection}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 text-center rounded-lg border border-dashed border-border mb-6">
          <ListTodo className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-[13px] text-muted-foreground mb-3">Nenhuma prioridade definida para esta semana</p>
          <Button size="sm" className="gradient-brand text-white border-0" onClick={() => setEditing(true)}>Definir Prioridades</Button>
        </div>
      )}

      {/* Team priorities (leader/admin view) */}
      {(isLeader || isAdmin) && allPriorities.filter(p => p.userId !== user?.id && p.weekStart === weekStart).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Prioridades da Equipe</h2>
          <div className="space-y-2">
            {allPriorities.filter(p => p.userId !== user?.id && p.weekStart === weekStart).map(p => (
              <div key={p.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-medium text-foreground">{p.userName}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {p.priorities.filter(pr => pr.completed).length}/{p.priorities.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {p.priorities.map((pr, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {pr.completed ? <CheckCircle2 className="h-3 w-3 text-success" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
                      <span className={`text-[12px] ${pr.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>{pr.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
