import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AvaliacaoDashboard } from "@/components/avaliacao/AvaliacaoDashboard";
import { AvaliacaoConfig } from "@/components/avaliacao/AvaliacaoConfig";
import { AvaliacaoForm } from "@/components/avaliacao/AvaliacaoForm";
import { AvaliacaoRespostas } from "@/components/avaliacao/AvaliacaoRespostas";
import { Settings, FileText, BarChart3, ClipboardList } from "lucide-react";

export default function AvaliacaoPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <>
      <PageHeader title="Avaliação de Desempenho" subtitle="Ciclo de Avaliação de Potencial 2026">
        <Button size="sm" className="gradient-brand text-primary-foreground border-0 text-[13px]">
          Nova Avaliação
        </Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6 bg-muted/50 p-0.5">
          <TabsTrigger value="dashboard" className="gap-1.5 text-[13px]">
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="respostas" className="gap-1.5 text-[13px]">
            <ClipboardList className="h-3.5 w-3.5" />
            Respostas
          </TabsTrigger>
          <TabsTrigger value="formulario" className="gap-1.5 text-[13px]">
            <FileText className="h-3.5 w-3.5" />
            Formulário
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5 text-[13px]">
            <Settings className="h-3.5 w-3.5" />
            Configuração
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
