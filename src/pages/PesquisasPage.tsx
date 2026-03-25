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
import { surveyStore, surveyResponseStore, type SurveyRecord, type SurveyQuestion, type SurveyResponse } from "@/lib/dataStore";
import { FileQuestion, Plus, BarChart3, ClipboardList, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function PesquisasPage() {
  const { user, isAdmin } = useAuth();
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [answering, setAnswering] = useState<SurveyRecord | null>(null);
  const [tab, setTab] = useState(isAdmin ? "gerenciar" : "responder");

  useEffect(() => { refresh(); }, [user]);

  const refresh = () => {
    setSurveys(isAdmin ? surveyStore.getAll() : surveyStore.getActive());
  };

  const myResponses = surveyResponseStore.getByUser(user?.id || "");
  const answeredIds = new Set(myResponses.map(r => r.surveyId));
  const pendingSurveys = surveys.filter(s => s.status === "ativa" && !answeredIds.has(s.id));
  const completedSurveys = surveys.filter(s => answeredIds.has(s.id));

  return (
    <>
      <PageHeader title="Pesquisas" subtitle="Pesquisas de clima, pulsos e eNPS">
        {isAdmin && (
          <Dialog open={showNew} onOpenChange={setShowNew}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Nova Pesquisa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Criar Pesquisa</DialogTitle></DialogHeader>
              <SurveyForm user={user!} onSave={() => { setShowNew(false); refresh(); toast.success("Pesquisa criada!"); }} />
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-muted/50 p-0.5">
          <TabsTrigger value="responder" className="gap-1.5 text-[13px]">
            <ClipboardList className="h-3.5 w-3.5" /> Responder {pendingSurveys.length > 0 && <Badge variant="secondary" className="ml-1 text-[9px] px-1.5">{pendingSurveys.length}</Badge>}
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="gerenciar" className="gap-1.5 text-[13px]">
              <BarChart3 className="h-3.5 w-3.5" /> Gerenciar
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="responder">
          {pendingSurveys.length === 0 && completedSurveys.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FileQuestion className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma pesquisa disponível no momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSurveys.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Pendentes</h3>
                  <div className="space-y-2">
                    {pendingSurveys.map(s => (
                      <div key={s.id} className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{s.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {s.questions.length} pergunta(s) · Até {new Date(s.endDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Button size="sm" className="gradient-brand text-white border-0 text-[12px] gap-1" onClick={() => setAnswering(s)}>
                            <Send className="h-3 w-3" /> Responder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {completedSurveys.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Respondidas</h3>
                  <div className="space-y-2">
                    {completedSurveys.map(s => (
                      <div key={s.id} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-medium text-foreground">{s.title}</p>
                          <p className="text-[11px] text-muted-foreground">{s.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] gap-1 text-success">
                          <CheckCircle2 className="h-3 w-3" /> Respondida
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="gerenciar">
            {surveys.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <FileQuestion className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Nenhuma pesquisa criada</p>
                <Button size="sm" onClick={() => setShowNew(true)} className="gradient-brand text-white border-0">Criar primeira pesquisa</Button>
              </div>
            ) : (
              <div className="space-y-2">
                {surveys.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(s => {
                  const responses = surveyResponseStore.getBySurvey(s.id);
                  return (
                    <div key={s.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[13px] font-medium text-foreground">{s.title}</p>
                            <Badge variant={s.status === "ativa" ? "default" : s.status === "rascunho" ? "secondary" : "outline"} className="text-[10px]">
                              {s.status === "ativa" ? "Ativa" : s.status === "rascunho" ? "Rascunho" : "Encerrada"}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{s.type.toUpperCase()}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{s.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{responses.length} resposta(s) · {s.questions.length} pergunta(s)</p>
                        </div>
                        <div className="flex gap-1">
                          {s.status === "rascunho" && (
                            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => { surveyStore.update(s.id, { status: "ativa" }); refresh(); toast.success("Pesquisa ativada!"); }}>Ativar</Button>
                          )}
                          {s.status === "ativa" && (
                            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => { surveyStore.update(s.id, { status: "encerrada" }); refresh(); }}>Encerrar</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Answer Dialog */}
      <Dialog open={!!answering} onOpenChange={(open) => !open && setAnswering(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{answering?.title}</DialogTitle></DialogHeader>
          {answering && (
            <AnswerForm survey={answering} user={user!} onSave={() => { setAnswering(null); refresh(); toast.success("Resposta enviada!"); }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AnswerForm({ survey, user, onSave }: { survey: SurveyRecord; user: any; onSave: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    surveyResponseStore.create({
      surveyId: survey.id,
      userId: user.id,
      userName: user.name,
      answers,
      anonymous: true,
      submittedAt: new Date().toISOString(),
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-[12px] text-muted-foreground">{survey.description}</p>
      {survey.questions.map((q, i) => (
        <div key={q.id} className="space-y-2">
          <Label className="text-[13px] font-medium">{i + 1}. {q.text} {q.required && <span className="text-destructive">*</span>}</Label>
          {q.type === "escala" && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} type="button" onClick={() => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                  className={`h-10 w-10 rounded-lg border text-sm font-medium transition-colors ${answers[q.id] === v ? "gradient-brand text-white border-transparent" : "border-border hover:bg-muted"}`}>{v}</button>
              ))}
            </div>
          )}
          {q.type === "texto" && (
            <Textarea rows={2} value={(answers[q.id] as string) || ""} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder="Sua resposta..." />
          )}
          {q.type === "sim_nao" && (
            <div className="flex gap-2">
              {["Sim", "Não"].map(v => (
                <button key={v} type="button" onClick={() => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                  className={`px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors ${answers[q.id] === v ? "gradient-brand text-white border-transparent" : "border-border hover:bg-muted"}`}>{v}</button>
              ))}
            </div>
          )}
          {q.type === "multipla_escolha" && q.options && (
            <div className="space-y-1.5">
              {q.options.map(opt => (
                <button key={opt} type="button" onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-[13px] transition-colors ${answers[q.id] === opt ? "border-primary bg-primary/5 text-foreground" : "border-border hover:bg-muted"}`}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      ))}
      <Button type="submit" className="w-full gradient-brand text-white border-0">Enviar Resposta</Button>
    </form>
  );
}

function SurveyForm({ user, onSave }: { user: any; onSave: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"clima" | "pulso" | "enps" | "custom">("pulso");
  const [endDate, setEndDate] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    { id: "q1", text: "", type: "escala", required: true },
  ]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: `q${prev.length + 1}`, text: "", type: "escala", required: true }]);
  };

  const updateQuestion = (idx: number, data: Partial<SurveyQuestion>) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...data } : q));
  };

  const removeQuestion = (idx: number) => {
    if (questions.length > 1) setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    surveyStore.create({
      title,
      description,
      type,
      status: "rascunho",
      questions: questions.filter(q => q.text),
      targetAudience: "todos",
      startDate: new Date().toISOString(),
      endDate,
      createdBy: user.name,
      createdAt: new Date().toISOString(),
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2">
          <Label className="text-[12px]">Título</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Pesquisa de Clima Q1 2026" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Tipo</Label>
          <Select value={type} onValueChange={(v: any) => setType(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="clima">Clima</SelectItem>
              <SelectItem value="pulso">Pulso</SelectItem>
              <SelectItem value="enps">eNPS</SelectItem>
              <SelectItem value="custom">Customizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Encerramento</Label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Descrição</Label>
        <Textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descrição da pesquisa..." />
      </div>

      <div className="space-y-3">
        <Label className="text-[12px]">Perguntas</Label>
        {questions.map((q, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1.5">
              <Input value={q.text} onChange={e => updateQuestion(i, { text: e.target.value })} placeholder={`Pergunta ${i + 1}`} />
              <Select value={q.type} onValueChange={(v: any) => updateQuestion(i, { type: v })}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="escala">Escala 1-5</SelectItem>
                  <SelectItem value="texto">Texto livre</SelectItem>
                  <SelectItem value="sim_nao">Sim/Não</SelectItem>
                  <SelectItem value="multipla_escolha">Múltipla escolha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {questions.length > 1 && (
              <Button type="button" variant="ghost" size="sm" className="text-destructive h-8" onClick={() => removeQuestion(i)}>×</Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="text-[12px]" onClick={addQuestion}>+ Adicionar pergunta</Button>
      </div>

      <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={!title || !endDate}>Criar Pesquisa (Rascunho)</Button>
    </form>
  );
}
