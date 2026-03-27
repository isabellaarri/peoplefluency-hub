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

// Módulo Separar — Offboarding
import OffboardingPage from "./pages/OffboardingPage";

// Placeholders para módulos futuros (Contratar + Inspirar)
// Quando as páginas forem criadas, substituir os imports abaixo
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
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* ── Módulo: Contratar ─────────────────────────────────────── */}
        <Route
          path="/contratar/vagas"
          element={
            <LeaderRoute>
              <ComingSoonPage
                title="Vagas & ATS"
                subtitle="Gestão de vagas, candidatos e processos seletivos"
                module="Contratar"
                moduleColor="#22BCFF"
                features={[
                  "Criação e gestão de vagas",
                  "ATS com etapas configuráveis (cadastro, entrevistas, seleção, aprovação)",
                  "Formulários de candidatura customizáveis",
                  "Dashboards com métricas: taxa de conversão, tempo de contratação",
                  "Job descriptions alinhados à estrutura hierárquica",
                  "Integração automática com base de colaboradores após contratação",
                ]}
              />
            </LeaderRoute>
          }
        />
        <Route
          path="/contratar/admissao"
          element={
            <LeaderRoute>
              <ComingSoonPage
                title="Admissão"
                subtitle="Fluxo de admissão CLT e PJ com etapas e documentos"
                module="Contratar"
                moduleColor="#22BCFF"
                features={[
                  "Formulário de admissão completo (dados pessoais, bancários, documentos)",
                  "Etapas: Aguardando preenchimento → Conferência RH → Concluída",
                  "Suporte a CLT e PJ com campos configuráveis por vínculo",
                  "Upload de documentos e anexos (RG, CPF, CTPS, diplomas)",
                  "Campos de dependentes, formação acadêmica e dados de emergência",
                  "Extração de relatórios e integração com contabilidade",
                ]}
              />
            </LeaderRoute>
          }
        />

        {/* ── Módulo: Inspirar ──────────────────────────────────────── */}
        <Route
          path="/inspirar/onboarding"
          element={
            <ComingSoonPage
              title="Onboarding"
              subtitle="Pesquisas automáticas e acompanhamento dos primeiros dias"
              module="Inspirar"
              moduleColor="#F370F3"
              features={[
                "Pesquisa de onboarding automática com envio configurável (15, 30, 45 dias)",
                "Formulários condicionais avançados (Typeform-like)",
                "Acompanhamento da jornada do novo colaborador",
                "Notificações e lembretes automáticos",
                "Dashboards de acompanhamento por gestor e departamento",
              ]}
            />
          }
        />
        <Route
          path="/inspirar/hub"
          element={
            <ComingSoonPage
              title="Hub Cultural"
              subtitle="Conteúdos, vídeos e materiais institucionais da Fluency"
              module="Inspirar"
              moduleColor="#F370F3"
              features={[
                "Vídeos do CEO e gravações de reuniões",
                "Guia do colaborador (CLT e PJ)",
                "Explicações sobre people ops, pagamentos, férias, benefícios",
                "Materiais de reconhecimento e plano de carreira",
                "Hub acessível e organizado por categoria",
              ]}
            />
          }
        />

        {/* ── Módulo: Engajar ───────────────────────────────────────── */}
        <Route path="/sentimentos" element={<SentimentosPage />} />
        <Route path="/prioridades" element={<PrioridadesPage />} />
        <Route path="/pdi" element={<PDIPage />} />
        <Route path="/ferias" element={<FeriasPage />} />
        <Route path="/pesquisas" element={<PesquisasPage />} />
        <Route
          path="/avaliacao"
          element={<LeaderRoute><AvaliacaoPage /></LeaderRoute>}
        />
        <Route
          path="/one-on-one"
          element={<LeaderRoute><OneOnOnePage /></LeaderRoute>}
        />
        <Route path="/entregas" element={<EntregasPage />} />

        {/* ── Módulo: Separar (Offboarding) ─────────────────────────── */}
        <Route
          path="/separar/offboarding"
          element={
            <LeaderRoute>
              <OffboardingPage />
            </LeaderRoute>
          }
        />

        {/* ── People Ops / Admin ────────────────────────────────────── */}
        <Route
          path="/equipe"
          element={<LeaderRoute><TeamPage /></LeaderRoute>}
        />
        <Route
          path="/people-planning"
          element={<AdminRoute><PeoplePlanningPage /></AdminRoute>}
        />
        <Route
          path="/relatorios"
          element={
            <AdminRoute>
              <ComingSoonPage
                title="Relatórios & Indicadores"
                subtitle="Dashboards completos com todos os indicadores de People"
                module="People Ops"
                moduleColor="#6F47E5"
                features={[
                  "Headcount, turnover, PCD, diferenças salariais por cargo",
                  "Admissões, desligamentos, tempo de casa, aniversários",
                  "Organograma ajustável com relações hierárquicas reais",
                  "Histórico de férias, passivos e benefícios",
                  "PDI, prioridades, sentimentos e histórico de pesquisas",
                  "Filtros: departamento, área, diretoria, gestor, vínculo",
                  "Exportação para Excel e imagens",
                ]}
              />
            </AdminRoute>
          }
        />

        {/* ── Informações ───────────────────────────────────────────── */}
        <Route path="/politicas" element={<PoliticasPage />} />
        <Route path="/loop-valor" element={<LoopValorPage />} />

        {/* ── Perfil ────────────────────────────────────────────────── */}
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
