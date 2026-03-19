import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { PackageCheck, Star, TrendingUp, Calendar, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const valores = [
  { name: "Satisfação do Cliente em Primeiro Lugar", short: "Cliente", color: "bg-fluency-blue/10 text-fluency-blue border-fluency-blue/20" },
  { name: "Segurança é Inegociável", short: "Segurança", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { name: "Inovar com Simplicidade", short: "Inovação", color: "bg-primary/10 text-primary border-primary/20" },
  { name: "Se Apaixonar Pelo Problema", short: "Problema", color: "bg-fluency-orange/10 text-fluency-orange border-fluency-orange/20" },
  { name: "Gerar Valor Para o Nosso Ecossistema", short: "Ecossistema", color: "bg-fluency-green/10 text-fluency-green border-fluency-green/20" },
  { name: "Desafio é a Nossa Diversão", short: "Desafio", color: "bg-fluency-pink/10 text-fluency-pink border-fluency-pink/20" },
];

const entregas = [
  { name: "Aimee Nascimento", semana: "10–14 Mar", entrega: "Implementação do novo fluxo de onboarding educacional", valor: 2, loopEtapa: "Entrega de Produto", rating: 5 },
  { name: "Carlos Spezin", semana: "10–14 Mar", entrega: "Renegociação de contratos B2B com 15% de economia", valor: 4, loopEtapa: "Operação Escalável", rating: 5 },
  { name: "Bruna Gavazzoni", semana: "10–14 Mar", entrega: "Lançamento campanha parceria educacional", valor: 0, loopEtapa: "Geração de Demanda", rating: 4 },
  { name: "Eduardo Paulino", semana: "10–14 Mar", entrega: "Redução de 30% no tempo de resposta do CX", valor: 3, loopEtapa: "Operação Escalável", rating: 5 },
  { name: "Thayna Simoes", semana: "10–14 Mar", entrega: "Automação de fluxos CRM para nutrição de leads", valor: 2, loopEtapa: "Conversão IA + Humano", rating: 4 },
];

export default function EntregasPage() {
  const [search, setSearch] = useState("");
  const filtered = entregas.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader title="Entregas Semanais" subtitle="Entregas vinculadas aos valores e ao loop de valor">
        <Button size="sm" className="gradient-brand text-primary-foreground border-0 text-[13px]">
          <Plus className="h-3.5 w-3.5 mr-1" /> Registrar Entrega
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Entregas" value={42} subtitle="esta semana" icon={PackageCheck} variant="purple" />
        <StatCard title="Nota Média" value="4.3" icon={Star} variant="green" />
        <StatCard title="Valor + Citado" value="Inovar" icon={TrendingUp} variant="blue" />
        <StatCard title="Semana" value="S12" subtitle="17–21 Mar" icon={Calendar} variant="orange" />
      </div>

      {/* Values */}
      <div className="flex flex-wrap gap-2 mb-6">
        {valores.map((v, i) => (
          <span key={i} className={`rounded-md border px-2.5 py-1 text-[11px] font-medium ${v.color}`}>
            {v.name}
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-[13px]" />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Colaborador</th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Entrega</th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Valor</th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Loop</th>
              <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Nota</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary">
                      {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="font-medium text-foreground">{e.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground max-w-[250px] truncate">{e.entrega}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${valores[e.valor].color}`}>
                    {valores[e.valor].short}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground text-[12px]">{e.loopEtapa}</td>
                <td className="px-3 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3 w-3 ${j < e.rating ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
