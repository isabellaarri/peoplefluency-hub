import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { orgApi, type OrgOverride } from "@/lib/api";
import { GitBranch, Users, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// ── Nó do organograma ─────────────────────────────────────────
function OrgNode({ person, reports, depth, onSelect }: {
  person: any;
  reports: any[];
  depth: number;
  onSelect: (p: any) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  const roleColor = person.role === "admin"
    ? "border-fluency-orange/40"
    : person.role === "leader"
    ? "border-primary/40"
    : "border-border";

  return (
    <div className="flex flex-col items-center">
      {/* Card do nó */}
      <div
        className={`relative flex flex-col items-center gap-1 rounded-lg border-2 bg-card px-3 py-2.5 cursor-pointer hover:border-primary/40 transition-colors min-w-[120px] ${roleColor}`}
        onClick={() => onSelect(person)}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}
        >
          {person.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
        </div>
        <p className="text-[11px] font-semibold text-foreground text-center leading-tight max-w-[100px]">
          {person.name.split(" ")[0]} {person.name.split(" ").slice(-1)[0]}
        </p>
        <p className="text-[9px] text-muted-foreground text-center leading-tight max-w-[100px]">
          {person.cargo}
        </p>
        <Badge variant="outline" className={`text-[8px] px-1 py-0 ${
          person.vinculo === "CLT"
            ? "border-fluency-blue/30 text-fluency-blue"
            : "border-fluency-orange/30 text-fluency-orange"
        }`}>
          {person.vinculo || "—"}
        </Badge>
        {reports.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold shadow-sm z-10"
          >
            {expanded ? "−" : `+${reports.length}`}
          </button>
        )}
      </div>

      {/* Liderados */}
      {expanded && reports.length > 0 && (
        <div className="mt-6">
          {/* Linha vertical de conexão */}
          <div className="flex justify-center">
            <div className="w-[1px] h-4 bg-border" />
          </div>
          {/* Linha horizontal */}
          {reports.length > 1 && (
            <div className="flex justify-center relative">
              <div
                className="h-[1px] bg-border absolute top-0"
                style={{
                  left: `calc(${100 / reports.length / 2}%)`,
                  right: `calc(${100 / reports.length / 2}%)`,
                }}
              />
            </div>
          )}
          <div className="flex gap-6 items-start">
            {reports.map((report: any) => (
              <div key={report.id} className="flex flex-col items-center">
                <div className="w-[1px] h-4 bg-border" />
                <OrgNode
                  person={report}
                  reports={[]}
                  depth={depth + 1}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Override form ─────────────────────────────────────────────
function OverrideForm({ onSave }: { onSave: () => void }) {
  const { user, allUsers } = useAuth();
  const [userId, setUserId] = useState("");
  const [overrideManagerId, setOverrideMgr] = useState("");
  const [context, setContext] = useState<OrgOverride["context"]>("todos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mgr = allUsers.find(u => u.id === overrideManagerId);
    if (!mgr || !user) return;
    orgApi.create({
      userId,
      overrideManagerId,
      overrideManagerName: mgr.name,
      context,
      createdBy: user.name,
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-fluency-orange/5 border border-fluency-orange/20 p-3 flex gap-2 text-[12px] text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-fluency-orange shrink-0 mt-0.5" />
        <p>Use quando o gestor real não corresponde ao gestor formal no sistema. Ex: Ana lidera Águida na prática, mas o sistema mostra Marcos.</p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Colaborador</Label>
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger><SelectValue placeholder="Quem vai ter o gestor ajustado?" /></SelectTrigger>
          <SelectContent>
            {allUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name} — {u.cargo}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Gestor real (override)</Label>
        <Select value={overrideManagerId} onValueChange={setOverrideMgr}>
          <SelectTrigger><SelectValue placeholder="Quem é o gestor na prática?" /></SelectTrigger>
          <SelectContent>
            {allUsers.filter(u => u.role !== "collaborator").map(u => (
              <SelectItem key={u.id} value={u.id}>{u.name} — {u.cargo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Aplicar em</Label>
        <Select value={context} onValueChange={(v: any) => setContext(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Tudo (pesquisas, avaliações, 1:1)</SelectItem>
            <SelectItem value="pesquisas">Somente pesquisas</SelectItem>
            <SelectItem value="avaliacoes">Somente avaliações</SelectItem>
            <SelectItem value="one_on_one">Somente 1:1</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full gradient-brand text-white border-0"
        disabled={!userId || !overrideManagerId}>
        Salvar ajuste de hierarquia
      </Button>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function OrgChartPage() {
  const { allUsers, isAdmin } = useAuth();
  const [overrides, setOverrides] = useState<OrgOverride[]>(() => orgApi.getAll());
  const [showOverride, setShowOverride] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  const refresh = () => setOverrides(orgApi.getAll());

  // Hierarquia: agrupa por gestor
  const hierarchy = useMemo(() => {
    const roots: any[] = [];
    const byManager: Record<string, any[]> = {};

    allUsers.forEach(u => {
      const override = overrides.find(o => o.userId === u.id && (o.context === "todos" || o.context === "avaliacoes"));
      const managerName = override ? override.overrideManagerName : u.gestorAtual;

      if (!managerName || managerName === u.name) {
        roots.push(u);
      } else {
        if (!byManager[managerName]) byManager[managerName] = [];
        byManager[managerName].push(u);
      }
    });

    return { roots, byManager };
  }, [allUsers, overrides]);

  const filteredUsers = search
    ? allUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.cargo.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <>
      <PageHeader title="Organograma" subtitle="Hierarquia formal e funcional da Fluency">
        {isAdmin && (
          <Button size="sm" variant="outline" className="text-[13px] gap-1.5"
            onClick={() => setShowOverride(true)}>
            <Edit className="h-3.5 w-3.5" /> Ajustar hierarquia
          </Button>
        )}
      </PageHeader>

      {/* Overrides ativos */}
      {overrides.length > 0 && (
        <div className="rounded-lg border border-fluency-orange/20 bg-fluency-orange/5 p-3 mb-4">
          <p className="text-[11px] font-semibold text-fluency-orange mb-2">
            {overrides.length} ajuste(s) de hierarquia ativo(s)
          </p>
          <div className="flex flex-wrap gap-2">
            {overrides.map(o => {
              const u = allUsers.find(u => u.id === o.userId);
              return (
                <div key={o.id} className="flex items-center gap-1.5 rounded-md bg-background border border-border px-2 py-1 text-[11px]">
                  <span className="font-medium">{u?.name}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{o.overrideManagerName}</span>
                  <Badge variant="outline" className="text-[9px]">{o.context}</Badge>
                  {isAdmin && (
                    <button onClick={() => { orgApi.delete(o.id); refresh(); toast.success("Override removido."); }}
                      className="text-destructive/60 hover:text-destructive ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <Input placeholder="Buscar colaborador..." value={search}
          onChange={e => setSearch(e.target.value)} className="h-8 text-[13px]" />
      </div>

      {/* Resultado de busca */}
      {filteredUsers && (
        <div className="space-y-1.5 mb-6">
          {filteredUsers.map(u => (
            <div key={u.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3 cursor-pointer hover:border-primary/20"
              onClick={() => setSelected(u)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}>
                {u.name.split(" ").map(n => n[0]).slice(0,2).join("")}
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">{u.name}</p>
                <p className="text-[11px] text-muted-foreground">{u.cargo} · {u.departamento}</p>
              </div>
              <div className="ml-auto text-[11px] text-muted-foreground">
                Gestor: {overrides.find(o => o.userId === u.id)?.overrideManagerName ?? u.gestorAtual ?? "—"}
                {overrides.find(o => o.userId === u.id) && (
                  <Badge className="ml-1 text-[9px] bg-fluency-orange/10 text-fluency-orange border-0">override</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Org chart visual */}
      {!search && (
        <div className="overflow-auto pb-8">
          <div className="flex gap-8 items-start min-w-max px-4 pt-4">
            {hierarchy.roots.map(root => (
              <OrgNode
                key={root.id}
                person={root}
                reports={hierarchy.byManager[root.name] ?? []}
                depth={0}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Detalhes</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}>
                  {selected.name.split(" ").map((n: string) => n[0]).slice(0,2).join("")}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground">{selected.name}</p>
                  <p className="text-[12px] text-muted-foreground">{selected.cargo}</p>
                </div>
              </div>
              {[
                ["Departamento", selected.departamento],
                ["Time", selected.time],
                ["Vínculo", selected.vinculo],
                ["Gestor formal", selected.gestorAtual],
                ["Gestor real", overrides.find(o => o.userId === selected.id)?.overrideManagerName ?? selected.gestorAtual],
                ["Cluster", selected.clusterCargo],
              ].map(([l, v]) => v && (
                <div key={l} className="flex justify-between text-[12px]">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Override dialog */}
      <Dialog open={showOverride} onOpenChange={setShowOverride}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ajustar hierarquia real</DialogTitle></DialogHeader>
          <OverrideForm onSave={() => { setShowOverride(false); refresh(); toast.success("Hierarquia ajustada!"); }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
