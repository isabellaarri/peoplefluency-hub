import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { AvaliacaoDashboard } from "@/components/avaliacao/AvaliacaoDashboard";
import { AvaliacaoConfig } from "@/components/avaliacao/AvaliacaoConfig";
import { AvaliacaoForm } from "@/components/avaliacao/AvaliacaoForm";
import { AvaliacaoRespostas } from "@/components/avaliacao/AvaliacaoRespostas";
import { Settings, FileText, BarChart3, ClipboardList, Plus } from "lucide-react";
import { toast } from "sonner";

function NovaAvaliacaoForm({ onSave }: { onSave: () => void }) {
  const [titulo, setTitulo] = useState("");
  const [ciclo, setCiclo] = useState("");
  const [modelo, setModelo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui entraria a criação real via store/API
    // Por ora salva no localStorage como exemplo
    const ciclos = JSON.parse(localStorage.getItem("fluency_ciclos_avaliacao") || "[]");
    ciclos.push({
      id: Math.random().toString(36).slice(2),
      titulo,
      ciclo,
      modelo,
      dataInicio,
      dataFim,
      descricao,
      status: "rascunho",
      criadoEm: new Date().toISOString(),
    });
    localStorage.setItem("fluency_ciclos_avaliacao", JSON.stringify(ciclos));
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Título do ciclo</Label>
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Avaliação de Potencial Q1 2026"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Período</Label>
          <Select value={ciclo} onValueChange={setCiclo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1 2026">Q1 2026</SelectItem>
              <SelectItem value="Q2 2026">Q2 2026</SelectItem>
              <SelectItem value="Q3 2026">Q3 2026</SelectItem>
              <SelectItem value="Q4 2026">Q4 2026</SelectItem>
              <SelectItem value="Semestral S1 2026">Semestral S1 2026</SelectItem>
              <SelectItem value="Semestral S2 2026">Semestral S2 2026</SelectItem>
              <SelectItem value="Anual 2026">Anual 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Modelo padrão</Label>
          <Select value={modelo} onValueChange={setModelo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="180">180° — Auto + Líder</SelectItem>
              <SelectItem value="270">270° — Auto + Líder + Par</SelectItem>
              <SelectItem value="360">360° — Completo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Data de início</Label>
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Data de encerramento</Label>
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[12px]">Descrição / Orientações</Label>
        <Textarea
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Instruções para os participantes..."
        />
      </div>

      {/* Preview */}
      <div className="rounded-lg bg-muted/40 border border-border p-3 text-[11px] text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground text-[12px]">O que acontece ao criar:</p>
        <p>• Ciclo criado como <strong>rascunho</strong> — sem notificações ainda</p>
        <p>• Configure competências e perguntas na aba <strong>Configuração</strong></p>
        <p>• Ative o ciclo quando estiver pronto para enviar aos colaboradores</p>
      </div>

      <Button
        type="submit"
        className="w-full gradient-brand text-white border-0"
        disabled={!titulo || !ciclo || !modelo || !dataInicio || !dataFim}
      >
        Criar ciclo (rascunho)
      </Button>
    </form>
  );
}

export default function AvaliacaoPage() {
  const [tab, setTab] = useState("dashboard");
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Avaliação de Desempenho"
        subtitle="Ciclo de Avaliação de Potencial 2026"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gradient-brand text-white border-0 text-[13px] gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar novo ciclo de avaliação</DialogTitle>
            </DialogHeader>
            <NovaAvaliacaoForm
              onSave={() => {
                setOpen(false);
                toast.success("Ciclo criado como rascunho! Configure e ative na aba Configuração.");
              }}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6 bg-muted/50 p-0.5">
          <TabsTrigger value="dashboard" className="gap-1.5 text-[13px]">
            <BarChart3 className="h-3.5 w-3.5" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="respostas" className="gap-1.5 text-[13px]">
            <ClipboardList className="h-3.5 w-3.5" /> Respostas
          </TabsTrigger>
          <TabsTrigger value="formulario" className="gap-1.5 text-[13px]">
            <FileText className="h-3.5 w-3.5" /> Formulário
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5 text-[13px]">
            <Settings className="h-3.5 w-3.5" /> Configuração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AvaliacaoDashboard />
        </TabsContent>
        <TabsContent value="respostas">
          <AvaliacaoRespostas />
        </TabsContent>
        <TabsContent value="formulario">
          <AvaliacaoForm />
        </TabsContent>
        <TabsContent value="config">
          <AvaliacaoConfig />
        </TabsContent>
      </Tabs>
    </>
  );
}
