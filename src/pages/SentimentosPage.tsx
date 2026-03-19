import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Heart, TrendingUp, TrendingDown, Smile, Frown, Meh } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const sentimentData = [
  { team: "Marketing", avg: 4.5, trend: "+0.2", positive: true, responses: 18, mood: "😊" },
  { team: "Revenue", avg: 3.8, trend: "-0.1", positive: false, responses: 24, mood: "😐" },
  { team: "Tecnologia", avg: 4.2, trend: "+0.4", positive: true, responses: 15, mood: "😊" },
  { team: "CX", avg: 3.5, trend: "-0.3", positive: false, responses: 12, mood: "😐" },
  { team: "Cursos", avg: 4.7, trend: "+0.5", positive: true, responses: 20, mood: "😊" },
  { team: "NINA", avg: 4.0, trend: "+0.1", positive: true, responses: 8, mood: "😊" },
];

const recentFeedback = [
  { text: "Me sinto muito apoiada pelo meu líder, mas gostaria de mais clareza nos objetivos da área.", date: "15/03", sentiment: "positive" },
  { text: "A carga de trabalho está pesada, precisamos de mais pessoas na equipe.", date: "14/03", sentiment: "negative" },
  { text: "Adorei o novo processo de 1:1, me sinto ouvida e valorizada.", date: "13/03", sentiment: "positive" },
  { text: "Gostaria de ter mais oportunidades de desenvolvimento e treinamentos.", date: "12/03", sentiment: "neutral" },
];

export default function SentimentosPage() {
  return (
    <>
      <PageHeader title="Sentimentos do Colaborador" subtitle="Pulse check contínuo — como sua equipe está se sentindo?">
        <Button className="gradient-brand text-primary-foreground border-0">Nova Pesquisa</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Sentimento Geral" value="4.1" subtitle="de 5.0" icon={Heart} variant="pink" trend={{ value: "+0.2 vs mês anterior", positive: true }} />
        <StatCard title="Respostas" value={97} subtitle="de 247 colaboradores" icon={Smile} variant="green" />
        <StatCard title="Melhor Time" value="Cursos" subtitle="4.7 média" icon={TrendingUp} variant="blue" />
        <StatCard title="Atenção" value="CX" subtitle="3.5 — queda de 0.3" icon={TrendingDown} variant="orange" />
      </div>

      {/* Teams */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Sentimento por Time</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sentimentData.map((t, i) => (
            <div key={i} className="rounded-lg border border-border p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{t.team}</span>
                <span className="text-2xl">{t.mood}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">{t.avg}</span>
                <span className={`text-xs font-medium mb-1 ${t.positive ? "text-success" : "text-destructive"}`}>
                  {t.positive ? "↑" : "↓"} {t.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t.responses} respostas</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Feedback */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Feedback Recente (Anônimo)</h2>
        <div className="space-y-3">
          {recentFeedback.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="mt-0.5">
                {f.sentiment === "positive" ? <Smile className="h-5 w-5 text-success" /> : f.sentiment === "negative" ? <Frown className="h-5 w-5 text-destructive" /> : <Meh className="h-5 w-5 text-warning" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{f.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
