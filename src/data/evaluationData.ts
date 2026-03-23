// Sample evaluation data extracted from the Fluency spreadsheet
import type { EvaluationModel, EvaluationType } from "./evaluationConfig";

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  gestor: string;
  gestorAtual: string;
  model: EvaluationModel;
  cargo: string;
  clusterCargo: string;
  departamento: string;
  time: string;
  cLevel: string;
  centroCusto: string;
  vinculo: string;
  dataAdmissao: string;
}

export interface EvaluationResponse {
  id: string;
  evaluatorName: string;
  evaluatedName: string;
  type: EvaluationType;
  model: EvaluationModel;
  timestamp: string;
  scores: {
    focoEstrategico: number;
    execucaoAgil: number;
    inovacao: number;
    conexaoDesenvolvimento: number;
    liderancaProxima?: number;
    liderancaInspiradora?: number;
    fomentoComunidade: number;
    geracaoDemanda: number;
    conversaoIaHumano: number;
    entregaEncantadora: number;
    operacaoEficiente: number;
  };
  feedbackCompetencias?: string;
  feedbackLider?: string;
  feedbackLoopValor?: string;
  mandaBem?: string;
  podeMelhorar?: string;
  status: "Respondido" | "Pendente";
}

export interface EvaluationCycle {
  id: string;
  name: string;
  year: number;
  status: "Ativo" | "Encerrado" | "Rascunho";
  startDate: string;
  endDate: string;
  totalCollaborators: number;
  completionRate: number;
}

// Sample collaborators from spreadsheet
export const sampleCollaborators: Collaborator[] = [
  { id: "1", name: "Aimee Nascimento", email: "aimee.nascimento@fluencyacademy.io", gestor: "Jullie Costa", gestorAtual: "Jullie Costa", model: "360", cargo: "Coordenador Experiência Educacional", clusterCargo: "COORDENADOR", departamento: "CURSOS", time: "TECNOLOGIA", cLevel: "Daniel Keichi", centroCusto: "CURSOS", vinculo: "CLT", dataAdmissao: "03/06/2024" },
  { id: "2", name: "Carlos Spezin", email: "carlos.lopes@fluencyacademy.io", gestor: "Rhavi Sant'Ana", gestorAtual: "Rhavi Sant'Ana", model: "360", cargo: "Presidente Executivo Empreenda", clusterCargo: "C-LEVEL", departamento: "C-CORPORATE", time: "C-LEVEL", cLevel: "Rhavi Sant'Ana", centroCusto: "C-CORPORATE", vinculo: "PJ", dataAdmissao: "01/11/2023" },
  { id: "3", name: "Felipe Yani", email: "felipe.yani@fluencyacademy.io", gestor: "Rhavi Sant'Ana", gestorAtual: "Rhavi Sant'Ana", model: "360", cargo: "Chief Operating Officer", clusterCargo: "C-LEVEL", departamento: "COO", time: "C-LEVEL", cLevel: "Rhavi Sant'Ana", centroCusto: "COO", vinculo: "PJ", dataAdmissao: "01/08/2025" },
  { id: "4", name: "Bruna Gavazzoni", email: "bruna.gavazzoni@fluencyacademy.io", gestor: "Carlos Spezin", gestorAtual: "Carlos Spezin", model: "360", cargo: "Coordenador Performance Operações IA", clusterCargo: "COORDENADOR", departamento: "NINA", time: "REVENUE", cLevel: "Carlos Spezin", centroCusto: "POS-DEPLOY & PERFORMANCE", vinculo: "CLT", dataAdmissao: "09/01/2023" },
  { id: "5", name: "Eduardo Paulino", email: "eduardo.paulino@fluencyacademy.io", gestor: "Juliana Aguiar", gestorAtual: "Juliana Aguiar", model: "360", cargo: "Coordenador CX", clusterCargo: "COORDENADOR", departamento: "CX", time: "REVENUE", cLevel: "Carlos Spezin", centroCusto: "ATIVACAO", vinculo: "CLT", dataAdmissao: "16/11/2022" },
  { id: "6", name: "Thayna Simoes", email: "thayna.simoes@fluencyacademy.io", gestor: "Felipe Yani", gestorAtual: "Felipe Yani", model: "360", cargo: "Coordenador CRM", clusterCargo: "COORDENADOR", departamento: "MARKETING", time: "MARKETING", cLevel: "Felipe Yani", centroCusto: "CRM", vinculo: "PJ", dataAdmissao: "05/05/2025" },
  { id: "7", name: "Aline Horie", email: "aline.horie@fluencyacademy.io", gestor: "Felipe Yani", gestorAtual: "Felipe Yani", model: "360", cargo: "Gerente Criação e Design II", clusterCargo: "GERENTE", departamento: "MARKETING", time: "MARKETING", cLevel: "Felipe Yani", centroCusto: "GER CRIACAO E DESIGN", vinculo: "PJ", dataAdmissao: "08/08/2021" },
  { id: "8", name: "Jullie Costa", email: "jullie@fluencyacademy.io", gestor: "Daniel Keichi", gestorAtual: "Daniel Keichi", model: "360", cargo: "Group Product Manager", clusterCargo: "GERENTE", departamento: "PRODUTO", time: "TECNOLOGIA", cLevel: "Daniel Keichi", centroCusto: "PRODUTO", vinculo: "PJ", dataAdmissao: "08/06/2023" },
  { id: "9", name: "Ana Vazquez", email: "ana.vazquez@fluencyacademy.io", gestor: "Marcus Ramos", gestorAtual: "Marcus Ramos", model: "270", cargo: "Especialista Metodologia Educacional II", clusterCargo: "ESPECIALISTA", departamento: "CURSOS", time: "TECNOLOGIA", cLevel: "Marcus Ramos", centroCusto: "CURSOS", vinculo: "CLT", dataAdmissao: "02/12/2022" },
  { id: "10", name: "Fabio Dias", email: "fabio.dias@fluencyacademy.io", gestor: "Carlos Spezin", gestorAtual: "Carlos Spezin", model: "360", cargo: "Coordenador Comercial B2C", clusterCargo: "COORDENADOR", departamento: "B2C", time: "REVENUE", cLevel: "Carlos Spezin", centroCusto: "B2C", vinculo: "CLT", dataAdmissao: "13/02/2023" },
  { id: "11", name: "Adelino Guimarães", email: "adelino@fluencyacademy.io", gestor: "Felipe Yani", gestorAtual: "Vania Brudzinski", model: "270", cargo: "Especialista Community Manager", clusterCargo: "ESPECIALISTA", departamento: "MARKETING", time: "MARKETING", cLevel: "Felipe Yani", centroCusto: "FCC", vinculo: "CLT", dataAdmissao: "18/11/2022" },
  { id: "12", name: "Guilherme Poersch", email: "guilherme.poersch@fluencyacademy.io", gestor: "Aline Horie", gestorAtual: "Aline Horie", model: "270", cargo: "Especialista Redação I", clusterCargo: "ESPECIALISTA", departamento: "MARKETING", time: "MARKETING", cLevel: "Felipe Yani", centroCusto: "REDACAO", vinculo: "CLT", dataAdmissao: "26/12/2022" },
];

// Sample evaluation responses from spreadsheet
export const sampleResponses: EvaluationResponse[] = [
  { id: "r1", evaluatorName: "Guilherme Poersch", evaluatedName: "Guilherme Poersch", type: "autoavaliacao", model: "270", timestamp: "2026-02-23", scores: { focoEstrategico: 4, execucaoAgil: 4, inovacao: 4, conexaoDesenvolvimento: 3, fomentoComunidade: 4, geracaoDemanda: 4, conversaoIaHumano: 4, entregaEncantadora: 4, operacaoEficiente: 4 }, mandaBem: "Visão de negócio e comprometimento", podeMelhorar: "Organização e reconexão com criatividade", status: "Respondido" },
  { id: "r2", evaluatorName: "Aline Horie", evaluatedName: "Guilherme Poersch", type: "lider_liderado", model: "270", timestamp: "2026-03-05", scores: { focoEstrategico: 4, execucaoAgil: 4, inovacao: 4, conexaoDesenvolvimento: 4, fomentoComunidade: 4, geracaoDemanda: 4, conversaoIaHumano: 4, entregaEncantadora: 4, operacaoEficiente: 4 }, mandaBem: "Visão estratégica e proatividade", podeMelhorar: "Gestão de prioridades em alta demanda", status: "Respondido" },
  { id: "r3", evaluatorName: "Bruna Portugal", evaluatedName: "Guilherme Poersch", type: "par", model: "270", timestamp: "2026-03-04", scores: { focoEstrategico: 4, execucaoAgil: 4, inovacao: 5, conexaoDesenvolvimento: 4, fomentoComunidade: 4, geracaoDemanda: 5, conversaoIaHumano: 4, entregaEncantadora: 4, operacaoEficiente: 4 }, mandaBem: "Criatividade e parceria com o time", podeMelhorar: "Documentação de processos", status: "Respondido" },
  { id: "r4", evaluatorName: "Aimee Nascimento", evaluatedName: "Aimee Nascimento", type: "autoavaliacao", model: "360", timestamp: "2026-02-25", scores: { focoEstrategico: 4, execucaoAgil: 4, inovacao: 3, conexaoDesenvolvimento: 4, liderancaProxima: 4, liderancaInspiradora: 4, fomentoComunidade: 4, geracaoDemanda: 3, conversaoIaHumano: 3, entregaEncantadora: 4, operacaoEficiente: 4 }, mandaBem: "Proatividade e visão abrangente", podeMelhorar: "Delegação de tarefas", status: "Respondido" },
  { id: "r5", evaluatorName: "Jullie Costa", evaluatedName: "Aimee Nascimento", type: "lider_liderado", model: "360", timestamp: "2026-03-05", scores: { focoEstrategico: 4, execucaoAgil: 5, inovacao: 4, conexaoDesenvolvimento: 4, fomentoComunidade: 4, geracaoDemanda: 4, conversaoIaHumano: 4, entregaEncantadora: 5, operacaoEficiente: 4 }, mandaBem: "Ownership e energia no time", podeMelhorar: "Visão de longo prazo", status: "Respondido" },
  { id: "r6", evaluatorName: "Vinicios Ramos", evaluatedName: "Aimee Nascimento", type: "par", model: "360", timestamp: "2026-02-26", scores: { focoEstrategico: 4, execucaoAgil: 4, inovacao: 3, conexaoDesenvolvimento: 4, fomentoComunidade: 4, geracaoDemanda: 4, conversaoIaHumano: 3, entregaEncantadora: 4, operacaoEficiente: 4 }, mandaBem: "Proatividade e apoio ao time", podeMelhorar: "Continuar fazendo o que faz!", status: "Respondido" },
  { id: "r7", evaluatorName: "Amanda Teixeira", evaluatedName: "Aimee Nascimento", type: "liderado_lider", model: "360", timestamp: "2026-03-03", scores: { focoEstrategico: 5, execucaoAgil: 5, inovacao: 4, conexaoDesenvolvimento: 5, liderancaProxima: 5, liderancaInspiradora: 5, fomentoComunidade: 5, geracaoDemanda: 4, conversaoIaHumano: 4, entregaEncantadora: 5, operacaoEficiente: 5 }, feedbackLider: "Liderança próxima e acessível", mandaBem: "Liderança e comunicação", podeMelhorar: "Nada a apontar", status: "Respondido" },
  { id: "r8", evaluatorName: "Fabio Dias", evaluatedName: "Fabio Dias", type: "autoavaliacao", model: "360", timestamp: "2026-03-01", scores: { focoEstrategico: 4, execucaoAgil: 5, inovacao: 4, conexaoDesenvolvimento: 5, liderancaProxima: 4, liderancaInspiradora: 4, fomentoComunidade: 4, geracaoDemanda: 5, conversaoIaHumano: 4, entregaEncantadora: 5, operacaoEficiente: 4 }, mandaBem: "Liderança e dedicação ao time", podeMelhorar: "Equilíbrio vida pessoal/profissional", status: "Respondido" },
];

// Current cycle
export const currentCycle: EvaluationCycle = {
  id: "cycle_2026",
  name: "Avaliação de Potencial 2026",
  year: 2026,
  status: "Ativo",
  startDate: "2026-02-12",
  endDate: "2026-03-15",
  totalCollaborators: 152,
  completionRate: 82,
};

// Department stats
export const departmentStats = [
  { dept: "REVENUE", total: 58, completed: 52, rate: 90 },
  { dept: "MARKETING", total: 32, completed: 26, rate: 81 },
  { dept: "TECNOLOGIA", total: 28, completed: 22, rate: 79 },
  { dept: "FINANCAS", total: 14, completed: 11, rate: 79 },
  { dept: "PEOPLE", total: 8, completed: 7, rate: 88 },
  { dept: "NEGOCIOS", total: 12, completed: 7, rate: 58 },
];
