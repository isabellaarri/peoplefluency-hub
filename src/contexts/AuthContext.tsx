import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sampleCollaborators } from "@/data/evaluationData";

export type UserRole = "admin" | "leader" | "collaborator";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cargo: string;
  departamento: string;
  time: string;
  gestorAtual: string;
  clusterCargo: string;
  centroCusto: string;
  vinculo: string;
  dataAdmissao: string;
  model: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isLeader: boolean;
  getTeamMembers: () => AuthUser[];
  allUsers: AuthUser[];
}

const AuthContext = createContext<AuthContextType | null>(null);

// Determine role from cluster/cargo
function determineRole(clusterCargo: string, name: string): UserRole {
  const adminEmails = ["paula@fluencyacademy.io", "rhavicarneiro@gmail.com"];
  const collab = sampleCollaborators.find(c => c.name === name);
  if (collab && adminEmails.includes(collab.email)) return "admin";
  
  const leaderClusters = ["C-LEVEL", "DIRETOR", "GERENTE", "COORDENADOR", "TL"];
  if (leaderClusters.includes(clusterCargo)) return "leader";
  return "collaborator";
}

// Build user list from collaborators
const allUsersData: AuthUser[] = sampleCollaborators
  .filter(c => c.email && c.name)
  .map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    role: determineRole(c.clusterCargo, c.name),
    cargo: c.cargo,
    departamento: c.departamento,
    time: c.time,
    gestorAtual: c.gestorAtual,
    clusterCargo: c.clusterCargo,
    centroCusto: c.centroCusto,
    vinculo: c.vinculo,
    dataAdmissao: c.dataAdmissao,
    model: c.model,
  }));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("fluency_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("fluency_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("fluency_user");
    }
  }, [user]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();
    const found = allUsersData.find(u => u.email.toLowerCase() === normalizedEmail);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === "admin";
  const isLeader = user?.role === "leader" || isAdmin;

  const getTeamMembers = (): AuthUser[] => {
    if (!user) return [];
    if (isAdmin) return allUsersData;
    return allUsersData.filter(u => u.gestorAtual === user.name);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLeader, getTeamMembers, allUsers: allUsersData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
