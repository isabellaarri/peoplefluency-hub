import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { PackageCheck, Star, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const valores = [
  "Satisfação do Cliente em Primeiro Lugar",
  "Segurança é Inegociável",
  "Inovar com Simplicidade",
  "Se Apaixonar Pelo Problema",
  "Gerar Valor Para o Nosso Ecossistema",
  "Desafio é a Nossa Diversão",
];

const entregas = [
  { name: "Aimee Nascimento", semana: "10–14 Mar", entrega: "Implementação do novo fluxo de onboarding educacional", valor: "Inovar com Simplicidade", rating: 5, loopEtapa: "Entrega de Produto" },
  { name: "Carlos Spezin", semana: "10–14 Mar", entrega: "Renegociação de contratos B2B com 15% de economia", valor: "Gerar Valor Para o Nosso Ecossistema", rating: 5, loopEtapa: "Operação Escalável" },
  { name: "Bruna Gavazzoni", semana: "10–14 Mar", entrega: "Lançamento campanha parceria educacional", valor: "Satisfação do Cliente em Primeiro Lugar", rating: 4, loopEtapa: "Geração de Demanda" },
  { name: "Eduardo Paulino", semana: "10–14 Mar", entrega: "Redução de 30% no tempo de resposta do CX", valor: "Se Apaixonar Pelo Problema", rating: 5, loopEtapa: "Operação Escalável" },
  { name: "Thayna Simoes", semana: "10–14 Mar", entrega: "Automação de fluxos CRM para nutrição de leads", valor: "Inovar com Simplicidade", rating: 4, loopEtapa: "Conversão IA + Humano" },
];

const valorColors: Record<string, string> = {
  "Satisfação do Cliente em Primeiro Lugar": "bg-fluency-blue/15 text-fluency-blue",
  "Segurança é Inegociável": "bg-destructive/15 text-destructive",
  "Inovar com Simplicidade": "bg-primary/15 text-primary",
  "Se Apaixonar Pelo Problema": "bg-fluency-orange/15 text-fluency-orange",
  "Gerar Valor Para o Nosso Ecossistema": "bg-fluency-green/15 text-fluency-green",
  "Desafio é a Nossa Diversão": "bg-fluency-pink/15 text-fluency-pink",
};

export default function EntregasPage() {
  return (
    <>
      <PageHeader title="Entregas Semanais" subtitle="Acompanhamento de entregas vinculadas aos valores e ao loop de valor">
        <Button className="gradient-brand text-primary-foreground border-0">Registrar Entrega</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Entregas Esta Semana" value={42} icon={PackageCheck} variant="purple" />
        <StatCard title="Nota Média" value="4.3" subtitle="de 5.0" icon={Star} variant="green" />
        <StatCard title="Valor Mais Citado" value="Inovar" subtitle="com Simplicidade" icon={TrendingUp} variant="blue" />
        <StatCard title="Semana Atual" value="S12" subtitle="17–21 Mar 2026" icon={Calendar} variant="orange" />
      </div>

      {/* Valores Grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Valores Fluency</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {valores.map((v, i) => (
            <div key={i} className={`rounded-lg px-4 py-3 text-sm font-medium ${valorColors[v]}`}>
              {v}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Entregas Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Colaborador</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Entrega</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Valor</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Loop</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Nota</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[250px]">{e.entrega}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${valorColors[e.valor]}`}>
                      {e.valor.split(" ").slice(0, 3).join(" ")}…
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="secondary" className="text-xs">{e.loopEtapa}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3.5 w-3.5 ${j < e.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
