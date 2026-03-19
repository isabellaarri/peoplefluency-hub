import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Target,
  Heart,
  PackageCheck,
  RefreshCw,
  GitBranch,
  ChevronLeft,
  ChevronRight,
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
  { title: "Entregas Semanais", url: "/entregas", icon: PackageCheck },
  { title: "Loop de Valor", url: "/loop-valor", icon: RefreshCw },
  { title: "People Planning", url: "/people-planning", icon: GitBranch },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`gradient-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } min-h-screen`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="gradient-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-primary-foreground">
          F
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-sidebar-primary-foreground">
              FLUENCY
            </span>
            <span className="text-[11px] text-sidebar-muted">
              People Management
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = item.url === "/" 
            ? location.pathname === "/"
            : location.pathname.startsWith(item.url);
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
              activeClassName=""
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 flex items-center justify-center rounded-lg py-2 text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
