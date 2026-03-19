import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import AvaliacaoPage from "./pages/AvaliacaoPage";
import OneOnOnePage from "./pages/OneOnOnePage";
import PDIPage from "./pages/PDIPage";
import SentimentosPage from "./pages/SentimentosPage";
import EntregasPage from "./pages/EntregasPage";
import LoopValorPage from "./pages/LoopValorPage";
import PeoplePlanningPage from "./pages/PeoplePlanningPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/avaliacao" element={<AvaliacaoPage />} />
            <Route path="/one-on-one" element={<OneOnOnePage />} />
            <Route path="/pdi" element={<PDIPage />} />
            <Route path="/sentimentos" element={<SentimentosPage />} />
            <Route path="/entregas" element={<EntregasPage />} />
            <Route path="/loop-valor" element={<LoopValorPage />} />
            <Route path="/people-planning" element={<PeoplePlanningPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
