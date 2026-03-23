import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  defaultCompetencies,
  defaultScale,
  evaluationModels,
  type EvaluationType,
  type EvaluationModel,
} from "@/data/evaluationConfig";
import { sampleCollaborators } from "@/data/evaluationData";
import { ChevronRight, Send, User } from "lucide-react";

type Step = "select" | "form" | "done";

export function AvaliacaoForm() {
  const [step, setStep] = useState<Step>("select");
  const [selectedEvaluated, setSelectedEvaluated] = useState("");
  const [evalType, setEvalType] = useState<EvaluationType>("autoavaliacao");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [openTexts, setOpenTexts] = useState<Record<string, string>>({});

  const evaluated = sampleCollaborators.find((c) => c.id === selectedEvaluated);
  const model: EvaluationModel = evaluated?.model || "180";

  const competenciesBase = defaultCompetencies.filter((c) => c.category === "competencia" && c.appliesTo.includes(model));
  const competenciesLider = defaultCompetencies.filter((c) => c.category === "lideranca" && c.appliesTo.includes(model));
  const competenciesLoop = defaultCompetencies.filter((c) => c.category === "loop_valor" && c.appliesTo.includes(model));

  const showLeadership = evalType === "liderado_lider" || (evalType === "autoavaliacao" && model === "360");

  const handleSubmit = () => {
    setStep("done");
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <Send className="h-7 w-7 text-success" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Avaliação Enviada!</h2>
        <p className="text-[13px] text-muted-foreground mb-4">Sua avaliação de {evaluated?.name} foi registrada com sucesso.</p>
        <Button variant="outline" size="sm" onClick={() => { setStep("select"); setScores({}); setOpenTexts({}); setSelectedEvaluated(""); }}>
          Nova Avaliação
        </Button>
      </div>
    );
  }

  if (step === "select") {
    return (
      <div className="max-w-lg mx-auto space-y-5 animate-fade-in">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Iniciar Avaliação</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-[12px] mb-1.5">Quem você vai avaliar?</Label>
              <Select value={selectedEvaluated} onValueChange={setSelectedEvaluated}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {sampleCollaborators.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-[13px]">
                      {c.name} — {c.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEvaluated && evaluated && (
              <>
                <div className="p-3 rounded-md bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {evaluated.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{evaluated.name}</p>
                      <p className="text-[11px] text-muted-foreground">{evaluated.cargo} • {evaluated.departamento}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px]">{evaluated.model}°</Badge>
                    <Badge variant="outline" className="text-[10px]">{evaluated.clusterCargo}</Badge>
                    <Badge variant="outline" className="text-[10px]">Gestor: {evaluated.gestor}</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-[12px] mb-1.5">Tipo de avaliação</Label>
                  <RadioGroup value={evalType} onValueChange={(v) => setEvalType(v as EvaluationType)} className="space-y-1.5">
                    {evaluationModels[model].types.map((t) => {
                      const labels: Record<string, string> = {
                        autoavaliacao: "Autoavaliação",
                        lider_liderado: "Líder → Liderado",
                        liderado_lider: "Liderado → Líder",
                        par: "Par",
                      };
                      return (
                        <div key={t} className="flex items-center gap-2">
                          <RadioGroupItem value={t} id={t} />
                          <Label htmlFor={t} className="text-[13px] font-normal cursor-pointer">{labels[t]}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <Button className="w-full gradient-brand text-primary-foreground" onClick={() => setStep("form")}>
                  Iniciar Formulário <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FORM STEP
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
          {evaluated?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-foreground">{evaluated?.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {evaluated?.cargo} • {evaluated?.model}° •{" "}
            {{ autoavaliacao: "Autoavaliação", lider_liderado: "Líder → Liderado", liderado_lider: "Liderado → Líder", par: "Par" }[evalType]}
          </p>
        </div>
      </div>

      {/* Competencies Section */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Competências</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Avalie de {defaultScale.min} a {defaultScale.max} cada competência</p>

        <div className="space-y-5">
          {competenciesBase.map((comp) => (
            <div key={comp.id}>
              <p className="text-[13px] font-medium text-foreground mb-0.5">{comp.name}</p>
              <p className="text-[11px] text-muted-foreground mb-2">{comp.description}</p>
              <div className="flex gap-2">
                {Array.from({ length: defaultScale.max - defaultScale.min + 1 }, (_, i) => i + defaultScale.min).map((val) => (
                  <button
                    key={val}
                    onClick={() => setScores({ ...scores, [comp.id]: val })}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border text-[13px] font-medium transition-all ${
                      scores[comp.id] === val
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              {scores[comp.id] && (
                <p className="text-[10px] text-muted-foreground mt-1">{defaultScale.labels[scores[comp.id]]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback competencies */}
      <div className="rounded-lg border border-border bg-card p-4">
        <Label className="text-[13px] font-medium">Espaço aberto para feedback sobre as competências</Label>
        <Textarea
          placeholder="Compartilhe observações sobre as competências avaliadas..."
          className="mt-2 text-[13px] min-h-[80px]"
          value={openTexts.feedbackCompetencias || ""}
          onChange={(e) => setOpenTexts({ ...openTexts, feedbackCompetencias: e.target.value })}
        />
      </div>

      {/* Leadership (conditional) */}
      {showLeadership && competenciesLider.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Liderança</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Avalie as competências de liderança</p>
          <div className="space-y-5">
            {competenciesLider.map((comp) => (
              <div key={comp.id}>
                <p className="text-[13px] font-medium text-foreground mb-0.5">{comp.name}</p>
                <p className="text-[11px] text-muted-foreground mb-2">{comp.description}</p>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((val) => (
                    <button
                      key={val}
                      onClick={() => setScores({ ...scores, [comp.id]: val })}
                      className={`flex h-9 w-9 items-center justify-center rounded-md border text-[13px] font-medium transition-all ${
                        scores[comp.id] === val
                          ? "border-fluency-pink bg-fluency-pink text-primary-foreground shadow-sm"
                          : "border-border bg-card text-foreground hover:border-fluency-pink/50 hover:bg-fluency-pink/5"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Label className="text-[13px] font-medium">Feedback sobre o líder</Label>
            <Textarea
              placeholder="Compartilhe feedback sobre a liderança..."
              className="mt-2 text-[13px] min-h-[80px]"
              value={openTexts.feedbackLider || ""}
              onChange={(e) => setOpenTexts({ ...openTexts, feedbackLider: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Loop de Valor */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Loop de Valor</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Avalie o impacto nas etapas do Loop de Valor da Fluency</p>
        <div className="space-y-5">
          {competenciesLoop.map((comp) => (
            <div key={comp.id}>
              <p className="text-[13px] font-medium text-foreground mb-0.5">{comp.name}</p>
              <p className="text-[11px] text-muted-foreground mb-2">{comp.description}</p>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((val) => (
                  <button
                    key={val}
                    onClick={() => setScores({ ...scores, [comp.id]: val })}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border text-[13px] font-medium transition-all ${
                      scores[comp.id] === val
                        ? "border-fluency-blue bg-fluency-blue text-primary-foreground shadow-sm"
                        : "border-border bg-card text-foreground hover:border-fluency-blue/50 hover:bg-fluency-blue/5"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Label className="text-[13px] font-medium">Feedback sobre o Loop de Valor</Label>
          <Textarea
            placeholder="Compartilhe observações sobre o impacto no loop de valor..."
            className="mt-2 text-[13px] min-h-[80px]"
            value={openTexts.feedbackLoop || ""}
            onChange={(e) => setOpenTexts({ ...openTexts, feedbackLoop: e.target.value })}
          />
        </div>
      </div>

      {/* Open feedback */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div>
          <Label className="text-[13px] font-medium">Essa pessoa manda bem em… <span className="text-destructive">*</span></Label>
          <Textarea
            placeholder="Pontos fortes e destaques..."
            className="mt-2 text-[13px] min-h-[80px]"
            value={openTexts.mandaBem || ""}
            onChange={(e) => setOpenTexts({ ...openTexts, mandaBem: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-[13px] font-medium">Essa pessoa pode melhorar os seguintes pontos… <span className="text-destructive">*</span></Label>
          <Textarea
            placeholder="Pontos de desenvolvimento..."
            className="mt-2 text-[13px] min-h-[80px]"
            value={openTexts.podeMelhorar || ""}
            onChange={(e) => setOpenTexts({ ...openTexts, podeMelhorar: e.target.value })}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => setStep("select")}>Voltar</Button>
        <Button className="gradient-brand text-primary-foreground" onClick={handleSubmit}>
          <Send className="h-4 w-4 mr-1.5" /> Enviar Avaliação
        </Button>
      </div>
    </div>
  );
}
