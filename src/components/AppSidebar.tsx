import {
  LayoutDashboard, ClipboardCheck, Users, Target, Heart, PackageCheck,
  RefreshCw, GitBranch, User, LogOut, Shield, UsersRound,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLeader } = useAuth();

  const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard, show: true },
    { title: "Avaliação", url: "/avaliacao", icon: ClipboardCheck, show: true },
    { title: "1:1", url: "/one-on-one", icon: Users, show: true },
    { title: "PDI", url: "/pdi", icon: Target, show: true },
    { title: "Sentimentos", url: "/sentimentos", icon: Heart, show: true },
    { title: "Entregas", url: "/entregas", icon: PackageCheck, show: true },
    { title: "Loop de Valor", url: "/loop-valor", icon: RefreshCw, show: true },
    { title: "Minha Equipe", url: "/equipe", icon: UsersRound, show: isLeader },
    { title: "People Planning", url: "/people-planning", icon: GitBranch, show: isAdmin },
  ];

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleLabel = isAdmin ? "Admin" : isLeader ? "Líder" : "Colaborador";
  const roleColor = isAdmin ? "bg-destructive/15 text-destructive" : isLeader ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground";

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out ${
        expanded ? "w-[220px]" : "w-[60px]"
      }`}
    >
      <div className="flex h-14 items-center gap-2.5 overflow-hidden px-3.5 gradient-brand">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/20 text-xs font-extrabold text-primary-foreground">F</div>
        <span className={`whitespace-nowrap text-sm font-bold tracking-wide text-primary-foreground transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>
          FLUENCY
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {menuItems.filter(m => m.show).map((item) => {
          const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={`group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-150 ${
                isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
              activeClassName=""
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
              <span className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5">
        {/* User info */}
        <NavLink
          to="/perfil"
          className="group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all duration-150"
          activeClassName="bg-sidebar-accent text-sidebar-primary"
        >
          <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold text-primary">
            {user?.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div className={`flex flex-col whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
            <span className="text-[12px] font-medium truncate max-w-[140px]">{user?.name}</span>
            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 w-fit ${roleColor}`}>{roleLabel}</Badge>
          </div>
        </NavLink>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150">
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>Sair</span>
        </button>
      </div>
    </aside>
  );
}
