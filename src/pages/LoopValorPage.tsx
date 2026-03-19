import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { RefreshCw, TrendingUp, BarChart2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const loopStages = [
  { name: "Fomento a Comunidade", desc: "Fortaleceu relações com público e comunidade", score: 4.1, icon: "🌐", color: "border-primary/30 bg-primary/5" },
  { name: "Geração de Demanda", desc: "Ampliou interesse, visibilidade e alcance", score: 3.8, icon: "📢", color: "border-fluency-orange/30 bg-fluency-orange/5" },
  { name: "Conversão IA + Humano", desc: "Melhorou efetividade da conversão", score: 4.0, icon: "🤖", color: "border-fluency-blue/30 bg-fluency-blue/5" },
  { name: "Entrega Encantadora de Produto", desc: "Elevou a experiência educacional", score: 4.3, icon: "✨", color: "border-fluency-green/30 bg-fluency-green/5" },
  { name: "Operação Eficiente e Escalável", desc: "Gerou ganhos de eficiência e escala", score: 3.9, icon: "⚡", color: "border-fluency-pink/30 bg-fluency-pink/5" },
];

const topContributors = [
  { name: "Aimee Nascimento", stage: "Entrega de Produto", score: 5, team: "Cursos" },
  { name: "Carlos Spezin", stage: "Operação Escalável", score: 5, team: "Revenue" },
  { name: "Eduardo Paulino", stage: "Operação Escalável", score: 5, team: "CX" },
  { name: "Thayna Simoes", stage: "Conversão IA + Humano", score: 4, team: "Marketing" },
  { name: "Bruna Gavazzoni", stage: "Geração de Demanda", score: 4, team: "Revenue" },
];

export default function LoopValorPage() {
  return (
    <>
      <PageHeader title="Loop de Valor" subtitle="Acompanhamento das 5 etapas do ciclo de valor da Fluency" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Score Geral" value="4.0" subtitle="de 5.0" icon={RefreshCw} variant="purple" />
        <StatCard title="Melhor Etapa" value="Entrega" subtitle="4.3 média" icon={TrendingUp} variant="green" />
        <StatCard title="Atenção" value="Demanda" subtitle="3.8 — menor score" icon={BarChart2} variant="orange" />
        <StatCard title="Avaliações" value={203} icon={Zap} variant="blue" />
      </div>

      {/* Loop Visualization */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Etapas do Loop de Valor</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {loopStages.map((s, i) => (
            <div key={i} className={`rounded-xl border-2 p-5 text-center transition-all hover:scale-[1.02] ${s.color}`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-sm font-bold text-foreground mb-1">{s.name}</div>
              <div className="text-xs text-muted-foreground mb-3">{s.desc}</div>
              <div className="text-2xl font-extrabold text-foreground">{s.score}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">média</div>
            </div>
          ))}
        </div>
        {/* Flow arrow */}
        <div className="hidden lg:flex items-center justify-center mt-4 text-muted-foreground">
          <RefreshCw className="h-5 w-5 text-primary mr-2" />
          <span className="text-xs">Ciclo contínuo de valor — cada etapa alimenta a próxima</span>
        </div>
      </motion.div>

      {/* Top Contributors */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Destaques no Loop de Valor</h2>
        <div className="space-y-3">
          {topContributors.map((c, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/20 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.team} — {c.stage}</p>
              </div>
              <div className="text-lg font-bold text-foreground">{c.score}/5</div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
