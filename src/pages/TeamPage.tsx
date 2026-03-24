import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";

export default function TeamPage() {
  const { user, isLeader, isAdmin, getTeamMembers } = useAuth();

  if (!isLeader) {
    return (
      <>
        <PageHeader title="Minha Equipe" subtitle="Acesso restrito a líderes" />
        <p className="text-sm text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </>
    );
  }

  const team = getTeamMembers().filter(m => m.id !== user?.id);

  return (
    <>
      <PageHeader title="Minha Equipe" subtitle={`${team.length} liderados diretos`} />

      <div className="space-y-2">
        {team.map(member => (
          <Link key={member.id} to={`/perfil/${member.id}`}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground">{member.name}</p>
              <p className="text-[11px] text-muted-foreground">{member.cargo} · {member.departamento}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{member.model}°</Badge>
              <Badge variant="secondary" className="text-[10px]">{member.clusterCargo}</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}

        {team.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum liderado direto encontrado na base</p>
          </div>
        )}
      </div>
    </>
  );
}
