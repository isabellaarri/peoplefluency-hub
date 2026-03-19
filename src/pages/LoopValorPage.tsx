import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { RefreshCw, TrendingUp, BarChart2, Zap } from "lucide-react";

const loopStages = [
  { name: "Fomento a Comunidade", desc: "Fortaleceu relações com público e comunidade", score: 4.1, icon: "🌐" },
  { name: "Geração de Demanda", desc: "Ampliou interesse, visibilidade e alcance", score: 3.8, icon: "📢" },
  { name: "Conversão IA + Humano", desc: "Melhorou efetividade da conversão", score: 4.0, icon: "🤖" },
  { name: "Entrega Encantadora", desc: "Elevou a experiência educacional", score: 4.3, icon: "✨" },
  { name: "Operação Escalável", desc: "Gerou ganhos de eficiência e escala", score: 3.9, icon: "⚡" },
];

const topContributors = [
  { name: "Aimee Nascimento", stage: "Entrega Encantadora", score: 5, team: "Cursos" },
  { name: "Carlos Spezin", stage: "Operação Escalável", score: 5, team: "Revenue" },
  { name: "Eduardo Paulino", stage: "Operação Escalável", score: 5, team: "CX" },
  { name: "Thayna Simoes", stage: "Conversão IA + Humano", score: 4, team: "Marketing" },
  { name: "Bruna Gavazzoni", stage: "Geração de Demanda", score: 4, team: "Revenue" },
];

export default function LoopValorPage() {
  return (
    <>
      <PageHeader title="Loop de Valor" subtitle="Acompanhamento das 5 etapas do ciclo de valor da Fluency" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Score Geral" value="4.0" icon={RefreshCw} variant="purple" />
        <StatCard title="Melhor Etapa" value="Entrega" subtitle="4.3" icon={TrendingUp} variant="green" />
        <StatCard title="Atenção" value="Demanda" subtitle="3.8" icon={BarChart2} variant="orange" />
        <StatCard title="Avaliações" value={203} icon={Zap} variant="blue" />
      </div>

      {/* Loop Flow */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Etapas do Loop</h2>
        <div className="flex flex-col lg:flex-row gap-3">
          {loopStages.map((s, i) => (
            <div key={i} className="flex-1 rounded-lg border border-border p-4 text-center hover:border-primary/30 transition-colors">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-[12px] font-semibold text-foreground mb-0.5">{s.name}</p>
              <p className="text-[10px] text-muted-foreground mb-2 leading-tight">{s.desc}</p>
              <p className="text-xl font-bold text-foreground">{s.score}</p>
              {i < loopStages.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 text-muted-foreground">→</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-3 gap-2 text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px]">Ciclo contínuo — cada etapa alimenta a próxima</span>
        </div>
      </div>

      {/* Top */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Destaques</h2>
        <div className="space-y-1.5">
          {topContributors.map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md p-2.5 hover:bg-muted/30 transition-colors">
              <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-brand text-[10px] font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.team} — {c.stage}</p>
              </div>
              <span className="text-[13px] font-semibold text-foreground">{c.score}/5</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
