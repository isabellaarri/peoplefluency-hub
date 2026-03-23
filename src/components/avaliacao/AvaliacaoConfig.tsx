import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  defaultCompetencies,
  defaultScale,
  evaluationTypes,
  evaluationModels,
  clusterModelMapping,
  type Competency,
  type EvaluationTypeConfig,
  type ScaleConfig,
} from "@/data/evaluationConfig";
import { Pencil, Plus, Trash2, Save, GripVertical, ChevronDown, ChevronUp } from "lucide-react";

export function AvaliacaoConfig() {
  const [competencies, setCompetencies] = useState<Competency[]>(defaultCompetencies);
  const [evalTypes, setEvalTypes] = useState<EvaluationTypeConfig[]>(evaluationTypes);
  const [scale, setScale] = useState<ScaleConfig>(defaultScale);
  const [editingComp, setEditingComp] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("competencias");

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? "" : s);

  const updateCompWeight = (id: string, weight: number) => {
    setCompetencies(competencies.map((c) => (c.id === id ? { ...c, weight } : c)));
  };

  const updateTypeWeight = (id: string, weight: number) => {
    setEvalTypes(evalTypes.map((t) => (t.id === id ? { ...t, weight } : t)));
  };

  const totalTypeWeight = evalTypes.reduce((s, t) => s + t.weight, 0);

  const categoryLabels: Record<string, string> = {
    competencia: "Competências Base",
    lideranca: "Liderança",
    loop_valor: "Loop de Valor",
  };

  const categoryColors: Record<string, string> = {
    competencia: "bg-primary/10 text-primary",
    lideranca: "bg-fluency-pink/10 text-fluency-pink",
    loop_valor: "bg-fluency-blue/10 text-fluency-blue",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Section: Scale */}
      <div className="rounded-lg border border-border bg-card">
        <button onClick={() => toggleSection("escala")} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Escala de Notas</h3>
            <p className="text-[11px] text-muted-foreground">Configure a escala utilizada nas avaliações</p>
          </div>
          {expandedSection === "escala" ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedSection === "escala" && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            <div className="grid gap-2">
              {Object.entries(scale.labels).map(([val, label]) => (
                <div key={val} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">{val}</div>
                  <Input
                    value={label}
                    onChange={(e) => setScale({ ...scale, labels: { ...scale.labels, [val]: e.target.value } })}
                    className="h-8 text-[13px] flex-1"
                  />
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-3 text-[12px]" variant="outline">
              <Save className="h-3 w-3 mr-1.5" /> Salvar Escala
            </Button>
          </div>
        )}
      </div>

      {/* Section: Evaluation Types & Weights */}
      <div className="rounded-lg border border-border bg-card">
        <button onClick={() => toggleSection("tipos")} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tipos de Avaliação & Pesos</h3>
            <p className="text-[11px] text-muted-foreground">
              Configure os pesos por tipo de avaliador • Total: <span className={totalTypeWeight === 100 ? "text-success" : "text-destructive"}>{totalTypeWeight}%</span>
            </p>
          </div>
          {expandedSection === "tipos" ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedSection === "tipos" && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            <div className="space-y-3">
              {evalTypes.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-muted/20">
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-foreground">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground">{t.description}</p>
                    <div className="flex gap-1 mt-1">
                      {t.appliesTo.map((m) => (
                        <Badge key={m} variant="secondary" className="text-[10px] px-1.5 py-0">{m}°</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={t.weight}
                      onChange={(e) => updateTypeWeight(t.id, Number(e.target.value))}
                      className="w-16 h-8 text-center text-[13px]"
                      min={0}
                      max={100}
                    />
                    <span className="text-[12px] text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
            {totalTypeWeight !== 100 && (
              <p className="text-[11px] text-destructive mt-2">⚠ Os pesos devem somar 100%. Atual: {totalTypeWeight}%</p>
            )}
          </div>
        )}
      </div>

      {/* Section: Evaluation Models */}
      <div className="rounded-lg border border-border bg-card">
        <button onClick={() => toggleSection("modelos")} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Modelos de Avaliação</h3>
            <p className="text-[11px] text-muted-foreground">180° / 270° / 360° — mapeamento por Cluster de Cargo</p>
          </div>
          {expandedSection === "modelos" ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedSection === "modelos" && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            <div className="grid gap-3 lg:grid-cols-3 mb-4">
              {(Object.entries(evaluationModels) as [string, { label: string; description: string; types: string[] }][]).map(([key, model]) => (
                <div key={key} className="p-3 rounded-md border border-border bg-muted/20">
                  <p className="text-sm font-semibold text-foreground">{model.label}</p>
                  <p className="text-[11px] text-muted-foreground mb-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.types.map((t) => {
                      const typeConfig = evalTypes.find((et) => et.id === t);
                      return (
                        <Badge key={t} variant="outline" className="text-[10px]">{typeConfig?.label || t}</Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-[12px] font-semibold text-foreground mb-2">Mapeamento Cluster → Modelo</h4>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(clusterModelMapping).map(([cluster, model]) => (
                <div key={cluster} className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-muted/30 text-[12px]">
                  <span className="text-foreground font-medium">{cluster}</span>
                  <Badge variant="secondary" className="text-[10px]">{model}°</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section: Competencies */}
      <div className="rounded-lg border border-border bg-card">
        <button onClick={() => toggleSection("competencias")} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Competências & Perguntas</h3>
            <p className="text-[11px] text-muted-foreground">{competencies.length} competências configuradas em 3 categorias</p>
          </div>
          {expandedSection === "competencias" ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedSection === "competencias" && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            {["competencia", "lideranca", "loop_valor"].map((cat) => {
              const catComps = competencies.filter((c) => c.category === cat);
              return (
                <div key={cat} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`text-[10px] ${categoryColors[cat]}`}>{categoryLabels[cat]}</Badge>
                    <span className="text-[11px] text-muted-foreground">{catComps.length} itens</span>
                  </div>
                  <div className="space-y-2">
                    {catComps.map((comp) => (
                      <div key={comp.id} className="p-3 rounded-md border border-border bg-muted/20">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            {editingComp === comp.id ? (
                              <div className="space-y-2">
                                <Input defaultValue={comp.name} className="h-7 text-[13px]" />
                                <Textarea defaultValue={comp.description} className="text-[12px] min-h-[60px]" />
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="text-[11px] h-6" onClick={() => setEditingComp(null)}>
                                    Cancelar
                                  </Button>
                                  <Button size="sm" className="text-[11px] h-6" onClick={() => setEditingComp(null)}>
                                    <Save className="h-3 w-3 mr-1" /> Salvar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab" />
                                  <p className="text-[13px] font-medium text-foreground">{comp.name}</p>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5 pl-5">{comp.description}</p>
                                <div className="flex items-center gap-2 mt-1.5 pl-5">
                                  <span className="text-[10px] text-muted-foreground">Modelos:</span>
                                  {comp.appliesTo.map((m) => (
                                    <Badge key={m} variant="outline" className="text-[9px] px-1.5 py-0">{m}°</Badge>
                                  ))}
                                  <span className="text-[10px] text-muted-foreground ml-2">Peso:</span>
                                  <Input
                                    type="number"
                                    value={comp.weight}
                                    onChange={(e) => updateCompWeight(comp.id, Number(e.target.value))}
                                    className="w-12 h-5 text-center text-[11px] px-1"
                                    min={0}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          {editingComp !== comp.id && (
                            <div className="flex gap-1">
                              <button onClick={() => setEditingComp(comp.id)} className="p-1 hover:bg-muted rounded">
                                <Pencil className="h-3 w-3 text-muted-foreground" />
                              </button>
                              <button className="p-1 hover:bg-destructive/10 rounded">
                                <Trash2 className="h-3 w-3 text-destructive/60" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <Button size="sm" variant="outline" className="mt-3 text-[12px]">
              <Plus className="h-3 w-3 mr-1.5" /> Adicionar Competência
            </Button>
          </div>
        )}
      </div>

      {/* Section: Open Questions */}
      <div className="rounded-lg border border-border bg-card">
        <button onClick={() => toggleSection("abertas")} className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Perguntas Abertas</h3>
            <p className="text-[11px] text-muted-foreground">Campos de texto aberto no formulário</p>
          </div>
          {expandedSection === "abertas" ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedSection === "abertas" && (
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
            {[
              { label: "Feedback sobre competências", required: false },
              { label: "Feedback sobre o líder", required: false },
              { label: "Feedback sobre o loop de valor", required: false },
              { label: "Essa pessoa manda bem em…", required: true },
              { label: "Essa pessoa pode melhorar…", required: true },
            ].map((q, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-md border border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab" />
                  <p className="text-[13px] text-foreground">{q.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Switch id={`req-${i}`} defaultChecked={q.required} className="scale-75" />
                    <Label htmlFor={`req-${i}`} className="text-[11px] text-muted-foreground">Obrigatória</Label>
                  </div>
                  <button className="p-1 hover:bg-muted rounded">
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
