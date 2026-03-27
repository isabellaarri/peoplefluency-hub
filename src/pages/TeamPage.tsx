import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ChevronRight, Users, Search, Heart, Target, MessageSquare } from "lucide-react";
import { sentimentStore, pdiStore, oneOnOneStore } from "@/lib/dataStore";

const moodEmoji = ["😩", "😔", "😐", "😊", "🤩"];
const moodColor = [
  "text-destructive",
  "text-fluency-orange",
  "text-warning",
  "text-fluency-blue",
  "text-fluency-green",
];

export default function TeamPage() {
  const { user, isLeader, isAdmin, getTeamMembers, allUsers } = useAuth();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("todos");
  const [filterCluster, setFilterCluster] = useState("todos");

  const baseTeam = isAdmin
    ? allUsers.filter((m) => m.id !== user?.id)
    : getTeamMembers().filter((m) => m.id !== user?.id);

  // Unique filter options
  const departments = ["todos", ...Array.from(new Set(baseTeam.map((m) => m.departamento))).sort()];
  const clusters = ["todos", ...Array.from(new Set(baseTeam.map((m) => m.clusterCargo))).sort()];

  // Apply filters
  const team = useMemo(() => {
    return baseTeam.filter((m) => {
      const matchSearch =
        search === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.cargo.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === "todos" || m.departamento === filterDept;
      const matchCluster = filterCluster === "todos" || m.clusterCargo === filterCluster;
      return matchSearch && matchDept && matchCluster;
    });
  }, [baseTeam, search, filterDept, filterCluster]);

  // Real data from stores
  const today = new Date().toISOString().split("T")[0];
  const allSentiments = sentimentStore.getAll();
  const allPdis = pdiStore.getAll();
  const allOneOnOnes = oneOnOneStore.getAll();

  const getLatestSentiment = (userId: string) => {
    return allSentiments
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  };

  const getPdiCount = (userId: string) =>
    allPdis.filter((p) => p.userId === userId && p.status !== "concluido").length;

  const getOneOnOneCount = (userId: string) =>
    allOneOnOnes.filter((o) => o.collaboratorId === userId || o.leaderId === userId).length;

  // Stats
  const checkedToday = baseTeam.filter((m) =>
    allSentiments.some((s) => s.userId === m.id && s.date.startsWith(today))
  ).length;

  const avgSentiment =
    allSentiments.length > 0
      ? (
          baseTeam
            .map((m) => getLatestSentiment(m.id)?.score)
            .filter(Boolean)
            .reduce((a, b) => a! + b!, 0)! /
          baseTeam.filter((m) => getLatestSentiment(m.id)).length
        ).toFixed(1)
      : "—";

  const atRisk = baseTeam.filter((m) => {
    const s = getLatestSentiment(m.id);
    return s && s.score <= 2;
  }).length;

  return (
    <>
      <PageHeader
        title={isAdmin ? "Colaboradores" : "Minha Equipe"}
        subtitle={`${team.length} de ${baseTeam.length} ${isAdmin ? "colaboradores" : "liderados"}`}
      />

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Total" value={baseTeam.length} icon={Users} variant="purple" />
        <StatCard title="Check-in hoje" value={`${checkedToday}/${baseTeam.length}`} icon={Heart} variant="pink" />
        <StatCard title="Sentimento médio" value={avgSentiment} icon={MessageSquare} variant="blue" />
        <StatCard title="Atenção" value={atRisk} subtitle="score ≤ 2" icon={Target} variant="orange" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[13px]"
          />
        </div>
        <Select value={filterDept} onValueChange={setFilterDept}>
          <SelectTrigger className="h-8 text-[13px] w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d === "todos" ? "Todos os departamentos" : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCluster} onValueChange={setFilterCluster}>
          <SelectTrigger className="h-8 text-[13px] w-[160px]">
            <SelectValue placeholder="Cluster" />
          </SelectTrigger>
          <SelectContent>
            {clusters.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "todos" ? "Todos os clusters" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team list */}
      <div className="space-y-1.5">
        {team.map((member) => {
          const latestSentiment = getLatestSentiment(member.id);
          const pdiCount = getPdiCount(member.id);
          const ooCount = getOneOnOneCount(member.id);
          const isAtRisk = latestSentiment && latestSentiment.score <= 2;

          return (
            <Link
              key={member.id}
              to={`/perfil/${member.id}`}
              className={`flex items-center gap-4 rounded-lg border bg-card p-3.5 hover:border-primary/30 transition-colors group ${
                isAtRisk ? "border-destructive/20 bg-destructive/3" : "border-border"
              }`}
            >
              {/* Avatar */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{
                  background: isAtRisk
                    ? "linear-gradient(135deg, hsl(0 72% 56%), hsl(16 100% 56%))"
                    : "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))",
                }}
              >
                {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{member.name}</p>
                  {isAtRisk && (
                    <Badge className="text-[9px] bg-destructive/10 text-destructive border-0">Atenção</Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {member.cargo} · {member.departamento}
                </p>
              </div>

              {/* Indicators */}
              <div className="hidden sm:flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {latestSentiment ? (
                    <span className={moodColor[latestSentiment.score - 1]}>
                      {moodEmoji[latestSentiment.score - 1]}
                    </span>
                  ) : "—"}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {pdiCount} PDI{pdiCount !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {ooCount} 1:1
                </span>
              </div>

              {/* Badges */}
              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className="text-[10px]">{member.model}°</Badge>
                <Badge variant="secondary" className="text-[10px]">{member.clusterCargo}</Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    member.vinculo === "CLT"
                      ? "border-fluency-blue/30 text-fluency-blue"
                      : "border-fluency-orange/30 text-fluency-orange"
                  }`}
                >
                  {member.vinculo}
                </Badge>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          );
        })}

        {team.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum colaborador encontrado</p>
          </div>
        )}
      </div>
    </>
  );
}
