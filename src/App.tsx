import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";

// Páginas existentes
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

// Módulo Separar
import OffboardingPage from "./pages/OffboardingPage";

// Novas páginas desta rodada
import AdmissaoPage from "./pages/AdmissaoPage";
import HubCulturalPage from "./pages/HubCulturalPage";
import OrgChartPage from "./pages/OrgChartPage";

// Placeholder para módulos ainda não desenvolvidos
import { ComingSoonPage } from "./pages/ComingSoonPage";

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
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* ── Contratar ─────────────────────────────────── */}
        <Route path="/contratar/vagas" element={
          <LeaderRoute>
            <ComingSoonPage title="Vagas & ATS" subtitle="Gestão de vagas e pipeline de candidatos"
              module="Contratar" moduleColor="#22BCFF"
              features={["Criação e gestão de vagas","Pipeline com etapas configuráveis","Formulários de candidatura","Dashboards: conversão, tempo de contratação","Integração automática com base de colaboradores"]} />
          </LeaderRoute>
        } />
        <Route path="/contratar/admissao" element={
          <LeaderRoute><AdmissaoPage /></LeaderRoute>
        } />

        {/* ── Inspirar ──────────────────────────────────── */}
        <Route path="/inspirar/onboarding" element={
          <ComingSoonPage title="Onboarding Automático" subtitle="Pesquisas disparadas por D+15, D+30, D+45"
            module="Inspirar" moduleColor="#F370F3"
            features={["Disparo automático baseado na data de admissão","Formulários condicionais (Typeform-like)","Acompanhamento da jornada do novo colaborador","Dashboards por gestor e departamento"]} />
        } />
        <Route path="/inspirar/hub" element={<HubCulturalPage />} />
        <Route path="/loop-valor" element={<LoopValorPage />} />
        <Route path="/politicas" element={<PoliticasPage />} />

        {/* ── Engajar ───────────────────────────────────── */}
        <Route path="/sentimentos" element={<SentimentosPage />} />
        <Route path="/prioridades" element={<PrioridadesPage />} />
        <Route path="/pdi" element={<PDIPage />} />
        <Route path="/ferias" element={<FeriasPage />} />
        <Route path="/pesquisas" element={<PesquisasPage />} />
        <Route path="/avaliacao" element={<LeaderRoute><AvaliacaoPage /></LeaderRoute>} />
        <Route path="/one-on-one" element={<LeaderRoute><OneOnOnePage /></LeaderRoute>} />
        <Route path="/entregas" element={<EntregasPage />} />

        {/* ── Separar ───────────────────────────────────── */}
        <Route path="/separar/offboarding" element={<LeaderRoute><OffboardingPage /></LeaderRoute>} />

        {/* ── People Ops ────────────────────────────────── */}
        <Route path="/equipe" element={<LeaderRoute><TeamPage /></LeaderRoute>} />
        <Route path="/people-planning" element={<AdminRoute><PeoplePlanningPage /></AdminRoute>} />
        <Route path="/organograma" element={<LeaderRoute><OrgChartPage /></LeaderRoute>} />
        <Route path="/relatorios" element={
          <AdminRoute>
            <ComingSoonPage title="Relatórios & Indicadores" subtitle="Dashboards completos exportáveis"
              module="People Ops" moduleColor="#6F47E5"
              features={["Headcount, turnover, PCD, diversidade","Exportar CSV / Excel por módulo","Filtros por departamento, área, diretoria, gestor","Histórico de férias, PDIs, sentimentos","Organograma com custo por departamento"]} />
          </AdminRoute>
        } />

        {/* ── Perfil ────────────────────────────────────── */}
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
