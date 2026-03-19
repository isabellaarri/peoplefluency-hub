import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, Calendar, MessageSquare, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const oneOnOnes = [
  { leader: "Jullie Costa", collaborator: "Aimee Nascimento", date: "15/03/2026", type: "Devolutiva", status: "Realizada", notes: "SCCS por competência concluído. PDI definido." },
  { leader: "Carlos Spezin", collaborator: "Bruna Gavazzoni", date: "14/03/2026", type: "Devolutiva", status: "Realizada", notes: "Feedback positivo em execução. PDI focado em inovação." },
  { leader: "Thayna Simoes", collaborator: "Lucas Silveira", date: "18/03/2026", type: "Acompanhamento", status: "Agendada", notes: "" },
  { leader: "Eduardo Paulino", collaborator: "Gisele Monteiro", date: "20/03/2026", type: "Devolutiva", status: "Agendada", notes: "" },
  { leader: "Vanessa Lopes", collaborator: "Ana Paula Ferreira", date: "13/03/2026", type: "Devolutiva", status: "Realizada", notes: "Consenso de nota ajustado. Enviado para People." },
  { leader: "Aline Horie", collaborator: "Adriel Silva", date: "19/03/2026", type: "Acompanhamento", status: "Pendente", notes: "" },
];

const statusStyles: Record<string, string> = {
  Realizada: "bg-success/15 text-success",
  Agendada: "bg-info/15 text-info",
  Pendente: "bg-warning/15 text-warning",
};

export default function OneOnOnePage() {
  return (
    <>
      <PageHeader title="1:1 — Devolutivas e Acompanhamento" subtitle="Registros de conversas individuais, feedback SCCS e consenso">
        <Button className="gradient-brand text-primary-foreground border-0">Nova 1:1</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="1:1s Realizadas" value={45} subtitle="Este ciclo" icon={CheckCircle2} variant="green" />
        <StatCard title="Agendadas" value={12} icon={Calendar} variant="blue" />
        <StatCard title="Pendentes" value={8} subtitle="Sem data definida" icon={Users} variant="orange" />
        <StatCard title="Taxa Conclusão" value="69%" icon={MessageSquare} variant="purple" trend={{ value: "+15% vs ciclo anterior", positive: true }} />
      </div>

      {/* SCCS Framework */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Modelo SCCS — Feedback por Competência</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { letter: "S", title: "Situação", desc: "Contexto específico do comportamento", color: "bg-primary/10 text-primary border-primary/20" },
            { letter: "C", title: "Comportamento", desc: "Comportamento observado, sem julgamentos", color: "bg-fluency-blue/10 text-fluency-blue border-fluency-blue/20" },
            { letter: "C", title: "Consequência", desc: "Impacto concreto gerado", color: "bg-fluency-orange/10 text-fluency-orange border-fluency-orange/20" },
            { letter: "S", title: "Solução (PDI)", desc: "Caminho de desenvolvimento", color: "bg-fluency-green/10 text-fluency-green border-fluency-green/20" },
          ].map((s, i) => (
            <div key={i} className={`rounded-lg border p-4 ${s.color}`}>
              <div className="text-2xl font-extrabold mb-1">{s.letter}</div>
              <div className="text-sm font-semibold mb-1">{s.title}</div>
              <div className="text-xs opacity-80">{s.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 1:1 List */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Líder</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Colaborador</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Data</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Tipo</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Observações</th>
              </tr>
            </thead>
            <tbody>
              {oneOnOnes.map((o, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{o.leader}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.collaborator}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{o.type}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{o.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
