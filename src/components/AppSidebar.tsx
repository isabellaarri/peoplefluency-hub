import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Target,
  Heart,
  PackageCheck,
  RefreshCw,
  GitBranch,
  User,
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Avaliação", url: "/avaliacao", icon: ClipboardCheck },
  { title: "1:1", url: "/one-on-one", icon: Users },
  { title: "PDI", url: "/pdi", icon: Target },
  { title: "Sentimentos", url: "/sentimentos", icon: Heart },
  { title: "Entregas", url: "/entregas", icon: PackageCheck },
  { title: "Loop de Valor", url: "/loop-valor", icon: RefreshCw },
  { title: "People Planning", url: "/people-planning", icon: GitBranch },
];

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out ${
        expanded ? "w-[220px]" : "w-[60px]"
      }`}
    >
      {/* Brand header bar */}
      <div className="flex h-14 items-center gap-2.5 overflow-hidden px-3.5 gradient-brand">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/20 text-xs font-extrabold text-primary-foreground">
          F
        </div>
        <span
          className={`whitespace-nowrap text-sm font-bold tracking-wide text-primary-foreground transition-opacity duration-200 ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          FLUENCY
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
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
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
              activeClassName=""
            >
              <item.icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive ? "text-sidebar-primary" : ""
                }`}
              />
              <span
                className={`whitespace-nowrap transition-opacity duration-200 ${
                  expanded ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5">
        <NavLink
          to="/perfil"
          className={`group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all duration-150`}
          activeClassName="bg-sidebar-accent text-sidebar-primary"
        >
          <User className="h-[18px] w-[18px] shrink-0" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
            Perfil
          </span>
        </NavLink>
        <button className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all duration-150">
          <Settings className="h-[18px] w-[18px] shrink-0" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
            Configurações
          </span>
        </button>
      </div>
    </aside>
  );
}
