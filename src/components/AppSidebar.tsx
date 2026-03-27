import {
  LayoutDashboard,
  Briefcase,
  UserPlus,
  Sparkles,
  BookOpen,
  Heart,
  ListTodo,
  Target,
  ClipboardCheck,
  MessageSquare,
  FileQuestion,
  DoorOpen,
  Users,
  GitBranch,
  BarChart2,
  Palmtree,
  RefreshCw,
  LogOut,
  UsersRound,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { surveyStore, surveyResponseStore } from "@/lib/dataStore";

// Pill de módulo colorida no sidebar expandido
const ModulePill = ({ label, color }: { label: string; color: string }) => (
  <span
    className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide opacity-70"
    style={{ background: color + "22", color }}
  >
    {label}
  </span>
);

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLeader } = useAuth();

  const pendingSurveys = surveyStore.getActive().filter((s) => {
    const answered = surveyResponseStore
      .getByUser(user?.id || "")
      .map((r) => r.surveyId);
    return !answered.includes(s.id);
  }).length;

  // ── 4 módulos do briefing Fluency Pathway ──────────────────────────────────
  const sections = [
    {
      label: null, // sem label para o início
      show: true,
      moduleColor: null,
      items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
      ],
    },
    {
      // Módulo 1 — Contratar: ATS + Recrutamento + Admissão
      label: "Contratar",
      show: isAdmin || isLeader,
      moduleColor: "#22BCFF", // fluency-blue
      items: [
        { title: "Vagas & ATS", url: "/contratar/vagas", icon: Briefcase },
        { title: "Admissão", url: "/contratar/admissao", icon: UserPlus },
      ],
    },
    {
      // Módulo 2 — Inspirar: Onboarding + Hub Cultural
      label: "Inspirar",
      show: true,
      moduleColor: "#F370F3", // fluency-pink
      items: [
        { title: "Onboarding", url: "/inspirar/onboarding", icon: Sparkles },
        { title: "Hub Cultural", url: "/inspirar/hub", icon: BookOpen },
        { title: "Loop de Valor", url: "/loop-valor", icon: RefreshCw },
        { title: "Políticas", url: "/politicas", icon: BookOpen },
      ],
    },
    {
      // Módulo 3 — Engajar: PDI, 1:1, Pesquisas, Sentimentos, Prioridades, Avaliação, Férias
      label: "Engajar",
      show: true,
      moduleColor: "#3CDF8A", // fluency-green
      items: [
        { title: "Sentimentos", url: "/sentimentos", icon: Heart },
        { title: "Prioridades", url: "/prioridades", icon: ListTodo },
        { title: "PDI", url: "/pdi", icon: Target },
        { title: "1:1", url: "/one-on-one", icon: MessageSquare },
        { title: "Avaliação", url: "/avaliacao", icon: ClipboardCheck, leaderOnly: true },
        {
          title: "Pesquisas",
          url: "/pesquisas",
          icon: FileQuestion,
          badge: pendingSurveys > 0 ? pendingSurveys : undefined,
        },
      ],
    },
    {
      // Módulo 4 — Separar: Offboarding
      label: "Separar",
      show: isAdmin || isLeader,
      moduleColor: "#FF4D1E", // fluency-orange
      items: [
        { title: "Offboarding", url: "/separar/offboarding", icon: DoorOpen },
      ],
    },
    {
      // People Ops — visível só para admin
      label: "People Ops",
      show: isAdmin,
      moduleColor: "#6F47E5", // fluency-purple
      items: [
        { title: "Colaboradores", url: "/equipe", icon: UsersRound },
        { title: "People Planning", url: "/people-planning", icon: GitBranch },
        { title: "Relatórios", url: "/relatorios", icon: BarChart2 },
      ],
    },
    {
      // Minha Equipe — só líder não-admin
      label: "Minha Equipe",
      show: isLeader && !isAdmin,
      moduleColor: "#6F47E5",
      items: [
        { title: "Equipe", url: "/equipe", icon: Users },
        { title: "Entregas", url: "/entregas", icon: RefreshCw },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = isAdmin ? "Admin" : isLeader ? "Líder" : "Colaborador";
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out ${
        expanded ? "w-[228px]" : "w-[60px]"
      }`}
    >
      {/* Logo — Fluency deep purple #320261 */}
      <div
        className="flex h-14 items-center gap-2.5 overflow-hidden px-3.5 shrink-0"
        style={{ background: "hsl(272 96% 19%)" }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/15 text-xs font-extrabold text-white">
          F
        </div>
        <div
          className={`whitespace-nowrap transition-opacity duration-200 ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[13px] font-bold tracking-wide text-white leading-none">
            FLUENCY
          </p>
          <p className="text-[9px] font-medium text-white/50 tracking-widest uppercase mt-0.5">
            Pathway
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 scrollbar-brand">
        {sections
          .filter((s) => s.show)
          .map((section, si) => (
            <div key={section.label ?? "inicio"}>
              {si > 0 && (
                <div className="my-2 mx-2 border-t border-sidebar-border" />
              )}

              {/* Section label com pill colorida do módulo */}
              {section.label && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 transition-all duration-200 ${
                    expanded ? "opacity-100" : "opacity-0 h-0 py-0 overflow-hidden"
                  }`}
                >
                  {section.moduleColor && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: section.moduleColor }}
                    />
                  )}
                  <p className="text-[9px] font-bold uppercase tracking-widest text-sidebar-muted">
                    {section.label}
                  </p>
                </div>
              )}

              <div className="space-y-0.5">
                {section.items
                  .filter((item) =>
                    "leaderOnly" in item && item.leaderOnly
                      ? isLeader || isAdmin
                      : true
                  )
                  .map((item) => {
                    const isActive =
                      item.url === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.url);
                    return (
                      <NavLink
                        key={item.url}
                        to={item.url}
                        end={item.url === "/"}
                        className={`group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                        }`}
                        activeClassName=""
                      >
                        <item.icon
                          className={`h-[18px] w-[18px] shrink-0 ${
                            isActive ? "text-sidebar-primary" : ""
                          }`}
                        />
                        <span
                          className={`whitespace-nowrap transition-opacity duration-200 flex-1 ${
                            expanded ? "opacity-100" : "opacity-0 w-0"
                          }`}
                        >
                          {item.title}
                        </span>
                        {"badge" in item && item.badge && expanded && (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1.5 text-[9px] bg-primary/15 text-primary"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5 shrink-0">
        <NavLink
          to="/perfil"
          className="group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all duration-150"
          activeClassName="bg-sidebar-accent text-sidebar-primary"
        >
          <div
            className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(256 74% 59%) 0%, hsl(300 88% 71%) 100%)",
            }}
          >
            {initials}
          </div>
          <div
            className={`flex flex-col whitespace-nowrap transition-opacity duration-200 ${
              expanded ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            <span className="text-[12px] font-medium truncate max-w-[140px]">
              {user?.name}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded w-fit font-semibold mt-0.5 ${
                isAdmin
                  ? "bg-fluency-orange/15 text-fluency-orange"
                  : isLeader
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {roleLabel}
            </span>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              expanded ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
