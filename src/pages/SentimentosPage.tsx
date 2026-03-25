import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { sentimentStore, type SentimentRecord } from "@/lib/dataStore";
import { Heart, Smile, Frown, Meh, TrendingUp, TrendingDown, Angry, Laugh } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";

const moodOptions = [
  { score: 1, label: "Muito mal", emoji: "😩", icon: Angry, color: "text-destructive border-destructive/30 bg-destructive/5" },
  { score: 2, label: "Mal", emoji: "😔", icon: Frown, color: "text-fluency-orange border-fluency-orange/30 bg-fluency-orange/5" },
  { score: 3, label: "Neutro", emoji: "😐", icon: Meh, color: "text-warning border-warning/30 bg-warning/5" },
  { score: 4, label: "Bem", emoji: "😊", icon: Smile, color: "text-fluency-blue border-fluency-blue/30 bg-fluency-blue/5" },
  { score: 5, label: "Muito bem!", emoji: "🤩", icon: Laugh, color: "text-success border-success/30 bg-success/5" },
];

const tagOptions = ["Carga de trabalho", "Reconhecimento", "Liderança", "Ambiente", "Desenvolvimento", "Benefícios", "Comunicação", "Equilíbrio vida-trabalho"];

function hasCheckedToday(userId: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return sentimentStore.getByUser(userId).some(s => s.date.startsWith(today));
}

export default function SentimentosPage() {
  const { user, isAdmin, isLeader, getTeamMembers } = useAuth();
  const [checkedToday, setCheckedToday] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allSentiments, setAllSentiments] = useState<SentimentRecord[]>([]);

  useEffect(() => {
    if (user) {
      setCheckedToday(hasCheckedToday(user.id));
      refreshAll();
    }
  }, [user]);

  const refreshAll = () => {
    if (!user) return;
    if (isAdmin) setAllSentiments(sentimentStore.getAll());
    else if (isLeader) {
      const teamIds = getTeamMembers().map(m => m.id);
      setAllSentiments(sentimentStore.getAll().filter(s => teamIds.includes(s.userId) || s.userId === user.id));
    } else setAllSentiments(sentimentStore.getByUser(user.id));
  };

  const handleSubmit = () => {
    if (!user || !selectedScore) return;
    sentimentStore.create({
      date: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      departamento: user.departamento,
      time: user.time,
      score: selectedScore,
      comment,
      tags: selectedTags,
    });
    setCheckedToday(true);
    setSelectedScore(null);
    setComment("");
    setSelectedTags([]);
    refreshAll();
    toast.success("Sentimento registrado! 💜");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const myHistory = sentimentStore.getByUser(user?.id || "").sort((a, b) => b.date.localeCompare(a.date));
  const avgScore = allSentiments.length > 0 ? (allSentiments.reduce((s, r) => s + r.score, 0) / allSentiments.length).toFixed(1) : "—";

  // Team overview for leaders
  const recentTeam = allSentiments.filter(s => {
    const d = new Date(s.date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  });

  return (
    <>
      <PageHeader title="Sentimentos" subtitle="Como você está se sentindo hoje?" />

      {/* Daily check-in card */}
      {!checkedToday ? (
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-1">Check-in do dia</h2>
          <p className="text-[13px] text-muted-foreground mb-5">Selecione como você está se sentindo agora</p>

          <div className="flex gap-3 mb-5 justify-center">
            {moodOptions.map(m => (
              <button key={m.score} onClick={() => setSelectedScore(m.score)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-4 py-3 transition-all ${
                  selectedScore === m.score ? m.color + " scale-105 shadow-sm" : "border-border bg-card hover:border-muted-foreground/30"
                }`}>
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          {selectedScore && (
            <>
              <div className="mb-4">
                <Label className="text-[12px] text-muted-foreground mb-2 block">O que influencia? (opcional)</Label>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
                        selectedTags.includes(tag) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                      }`}>{tag}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4 space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Quer compartilhar algo? (opcional, anônimo para o RH)</Label>
                <Textarea rows={2} value={comment} onChange={e => setComment(e.target.value)} placeholder="Suas palavras ajudam a melhorar o ambiente..." />
              </div>

              <Button className="gradient-brand text-white border-0 w-full" onClick={handleSubmit}>Registrar Sentimento</Button>
            </>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-success/20 bg-success/5 p-4 mb-6 flex items-center gap-3">
          <Smile className="h-5 w-5 text-success" />
          <div>
            <p className="text-[13px] font-medium text-foreground">Check-in de hoje realizado! ✨</p>
            <p className="text-[11px] text-muted-foreground">Volte amanhã para registrar novamente</p>
          </div>
        </div>
      )}

      {/* Stats for leaders */}
      {(isLeader || isAdmin) && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard title="Score Médio" value={avgScore} subtitle="últimos 7 dias" icon={Heart} variant="pink" />
          <StatCard title="Respostas" value={recentTeam.length} subtitle="esta semana" icon={Smile} variant="green" />
          <StatCard title="Melhor" value={recentTeam.length > 0 ? Math.max(...recentTeam.map(s => s.score)).toString() : "—"} icon={TrendingUp} variant="blue" />
          <StatCard title="Atenção" value={recentTeam.filter(s => s.score <= 2).length} subtitle="score ≤ 2" icon={TrendingDown} variant="orange" />
        </div>
      )}

      {/* My history */}
      {myHistory.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Meu Histórico</h2>
          <div className="space-y-1.5">
            {myHistory.slice(0, 10).map(s => {
              const mood = moodOptions.find(m => m.score === s.score);
              return (
                <div key={s.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
                  <span className="text-lg">{mood?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-foreground">{mood?.label}</p>
                    {s.comment && <p className="text-[11px] text-muted-foreground truncate">{s.comment}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.tags.map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{new Date(s.date).toLocaleDateString("pt-BR")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team sentiments for leaders */}
      {(isLeader || isAdmin) && recentTeam.filter(s => s.userId !== user?.id).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Sentimentos da Equipe (últimos 7 dias)</h2>
          <div className="space-y-1.5">
            {recentTeam.filter(s => s.userId !== user?.id).sort((a, b) => a.score - b.score).map(s => {
              const mood = moodOptions.find(m => m.score === s.score);
              return (
                <div key={s.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
                  <span className="text-lg">{mood?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground">{s.userName}</p>
                    {s.comment && <p className="text-[11px] text-muted-foreground truncate italic">"{s.comment}"</p>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.tags.map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{new Date(s.date).toLocaleDateString("pt-BR")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
