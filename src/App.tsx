import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import AvaliacaoPage from "./pages/AvaliacaoPage";
import OneOnOnePage from "./pages/OneOnOnePage";
import PDIPage from "./pages/PDIPage";
import SentimentosPage from "./pages/SentimentosPage";
import EntregasPage from "./pages/EntregasPage";
import LoopValorPage from "./pages/LoopValorPage";
import PeoplePlanningPage from "./pages/PeoplePlanningPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TeamPage from "./pages/TeamPage";
import FeriasPage from "./pages/FeriasPage";
import PesquisasPage from "./pages/PesquisasPage";
import PoliticasPage from "./pages/PoliticasPage";
import PrioridadesPage from "./pages/PrioridadesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function LeaderRoute({ children }: { children: React.ReactNode }) {
  const { user, isLeader } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isLeader) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        {/* Meu Espaço */}
        <Route path="/sentimentos" element={<SentimentosPage />} />
        <Route path="/prioridades" element={<PrioridadesPage />} />
        <Route path="/pdi" element={<PDIPage />} />
        <Route path="/ferias" element={<FeriasPage />} />
        <Route path="/pesquisas" element={<PesquisasPage />} />
        {/* Gestão */}
        <Route path="/avaliacao" element={<LeaderRoute><AvaliacaoPage /></LeaderRoute>} />
        <Route path="/one-on-one" element={<LeaderRoute><OneOnOnePage /></LeaderRoute>} />
        <Route path="/entregas" element={<EntregasPage />} />
        <Route path="/equipe" element={<LeaderRoute><TeamPage /></LeaderRoute>} />
        <Route path="/people-planning" element={<AdminRoute><PeoplePlanningPage /></AdminRoute>} />
        {/* Informações */}
        <Route path="/politicas" element={<PoliticasPage />} />
        <Route path="/loop-valor" element={<LoopValorPage />} />
        {/* Perfil */}
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/perfil/:userId" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
