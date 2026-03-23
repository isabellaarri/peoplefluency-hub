// ===== EVALUATION CONFIGURATION =====
// Based on Fluency Academy's "Avaliação de Potencial 2026" spreadsheet

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: "competencia" | "lideranca" | "loop_valor";
  weight: number;
  appliesTo: EvaluationModel[];
}

export type EvaluationModel = "180" | "270" | "360";
export type EvaluationType = "autoavaliacao" | "lider_liderado" | "liderado_lider" | "par";
export type QuestionType = "escala" | "texto_aberto" | "sim_nao";
export type ClusterCargo = "APRENDIZ" | "ANALISTA/ASSIST." | "ESPECIALISTA" | "TL" | "TE" | "COORDENADOR" | "GERENTE" | "DIRETOR" | "C-LEVEL";

export interface ScaleConfig {
  min: number;
  max: number;
  labels: Record<number, string>;
}

export interface EvaluationTypeConfig {
  id: EvaluationType;
  label: string;
  description: string;
  weight: number;
  appliesTo: EvaluationModel[];
}

export interface Question {
  id: string;
  competencyId: string;
  text: string;
  type: QuestionType;
  required: boolean;
  showFor: EvaluationType[];
  showForModels: EvaluationModel[];
}

// ===== SCALE =====
export const defaultScale: ScaleConfig = {
  min: 1,
  max: 5,
  labels: {
    1: "Muito abaixo do esperado",
    2: "Abaixo do esperado",
    3: "Atende ao esperado",
    4: "Acima do esperado",
    5: "Muito acima do esperado",
  },
};

// ===== COMPETENCIES =====
export const defaultCompetencies: Competency[] = [
  {
    id: "foco_estrategico",
    name: "Foco Estratégico e Analítico",
    description:
      "Escolhe bem onde colocar tempo e energia, tomando decisões e prioridades a partir da estratégia da Fluency e do contexto do negócio, embasando suas escolhas em informações, evidências e trocas relevantes.",
    category: "competencia",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "execucao_agil",
    name: "Execução Ágil",
    description:
      "Executa com ritmo, autonomia e confiabilidade, garantindo entregas dentro do que foi acordado, com organização, cumprimento de prazos e qualidade.",
    category: "competencia",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "inovacao",
    name: "Inovação",
    description:
      "Transforma problemas ou ineficiências em oportunidades de experimentação, testando soluções (inclusive com tecnologia/IA), aprendendo rapidamente com erros e ajustando rotas para ampliar resultados.",
    category: "competencia",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "conexao_desenvolvimento",
    name: "Conexão e Desenvolvimento",
    description:
      "Constrói relações de confiança e aprendizado mútuo, sustentando conversas difíceis com respeito, clareza e abertura a feedbacks, mesmo em contextos de divergência ou pressão.",
    category: "competencia",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  // Leadership competencies (360° only, when evaluating leaders)
  {
    id: "lideranca_proxima",
    name: "Liderança próxima e inspiradora",
    description:
      "Direciona o time com clareza, alinha expectativas e objetivos e assume responsabilidade pelos resultados e decisões do grupo.",
    category: "lideranca",
    weight: 1,
    appliesTo: ["360"],
  },
  {
    id: "lideranca_inspiradora",
    name: "Liderança inspiradora e cultura",
    description:
      "Exerce liderança inspiradora, direcionando com propósito e desenvolvendo as pessoas de forma intencional, promovendo um ambiente seguro e fortalecendo a cultura Fluency pelo exemplo.",
    category: "lideranca",
    weight: 1,
    appliesTo: ["360"],
  },
  // Loop de Valor competencies
  {
    id: "fomento_comunidade",
    name: "Fomento a Comunidade",
    description:
      "Fortaleceu relações com públicos estratégicos da Fluency por meio de projetos, iniciativas ou entregas realizadas.",
    category: "loop_valor",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "geracao_demanda",
    name: "Geração de Demanda",
    description:
      "Ampliou o interesse, a visibilidade ou as oportunidades de crescimento da Fluency a partir das iniciativas ou projetos sob sua responsabilidade.",
    category: "loop_valor",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "conversao_ia_humano",
    name: "Conversão com IA + Humano",
    description:
      "Melhorou a efetividade das decisões e a fluidez dos processos nos projetos ou rotinas sob sua responsabilidade.",
    category: "loop_valor",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "entrega_encantadora",
    name: "Entrega Encantadora de Produto",
    description:
      "Elevou a experiência, o aprendizado e o engajamento do aluno, bem como a qualidade percebida ou a confiança do cliente ou usuário interno.",
    category: "loop_valor",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "operacao_eficiente",
    name: "Operação Eficiente e Escalável",
    description:
      "Gerou ganhos de eficiência, organização ou sustentabilidade nos processos, rotinas ou projetos sob sua responsabilidade.",
    category: "loop_valor",
    weight: 1,
    appliesTo: ["180", "270", "360"],
  },
];

// ===== EVALUATION TYPES =====
export const evaluationTypes: EvaluationTypeConfig[] = [
  {
    id: "autoavaliacao",
    label: "Autoavaliação",
    description: "O colaborador avalia a si mesmo",
    weight: 10,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "lider_liderado",
    label: "Líder → Liderado",
    description: "O gestor avalia o liderado",
    weight: 50,
    appliesTo: ["180", "270", "360"],
  },
  {
    id: "liderado_lider",
    label: "Liderado → Líder",
    description: "O liderado avalia o gestor (apenas 360°)",
    weight: 20,
    appliesTo: ["360"],
  },
  {
    id: "par",
    label: "Par",
    description: "Avaliação entre pares indicados",
    weight: 20,
    appliesTo: ["270", "360"],
  },
];

// ===== MODEL DEFINITIONS =====
export const evaluationModels: Record<EvaluationModel, { label: string; description: string; types: EvaluationType[] }> = {
  "180": {
    label: "180°",
    description: "Autoavaliação + Avaliação do Líder",
    types: ["autoavaliacao", "lider_liderado"],
  },
  "270": {
    label: "270°",
    description: "Autoavaliação + Líder + Pares",
    types: ["autoavaliacao", "lider_liderado", "par"],
  },
  "360": {
    label: "360°",
    description: "Autoavaliação + Líder + Liderados + Pares",
    types: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"],
  },
};

// ===== CLUSTER → MODEL MAPPING =====
export const clusterModelMapping: Record<ClusterCargo, EvaluationModel> = {
  APRENDIZ: "180",
  "ANALISTA/ASSIST.": "180",
  ESPECIALISTA: "270",
  TL: "360",
  TE: "180",
  COORDENADOR: "360",
  GERENTE: "360",
  DIRETOR: "360",
  "C-LEVEL": "360",
};

// ===== QUESTIONS =====
export const defaultQuestions: Question[] = [
  // Competencies (scale questions)
  ...defaultCompetencies
    .filter((c) => c.category === "competencia")
    .map((c) => ({
      id: `q_${c.id}`,
      competencyId: c.id,
      text: c.description,
      type: "escala" as QuestionType,
      required: true,
      showFor: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"] as EvaluationType[],
      showForModels: c.appliesTo,
    })),
  // Leadership (scale - only for liderado>líder in 360°)
  ...defaultCompetencies
    .filter((c) => c.category === "lideranca")
    .map((c) => ({
      id: `q_${c.id}`,
      competencyId: c.id,
      text: c.description,
      type: "escala" as QuestionType,
      required: true,
      showFor: ["liderado_lider", "autoavaliacao"] as EvaluationType[],
      showForModels: ["360"] as EvaluationModel[],
    })),
  // Loop de Valor (scale)
  ...defaultCompetencies
    .filter((c) => c.category === "loop_valor")
    .map((c) => ({
      id: `q_${c.id}`,
      competencyId: c.id,
      text: c.description,
      type: "escala" as QuestionType,
      required: true,
      showFor: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"] as EvaluationType[],
      showForModels: c.appliesTo,
    })),
  // Open text questions
  {
    id: "q_feedback_competencias",
    competencyId: "",
    text: "Espaço aberto para feedback sobre as competências",
    type: "texto_aberto",
    required: false,
    showFor: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"],
    showForModels: ["180", "270", "360"],
  },
  {
    id: "q_feedback_lider",
    competencyId: "",
    text: "Espaço aberto para feedback sobre o líder",
    type: "texto_aberto",
    required: false,
    showFor: ["liderado_lider"],
    showForModels: ["360"],
  },
  {
    id: "q_feedback_loop_valor",
    competencyId: "",
    text: "Espaço aberto para feedback sobre o loop de valor",
    type: "texto_aberto",
    required: false,
    showFor: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"],
    showForModels: ["180", "270", "360"],
  },
  {
    id: "q_manda_bem",
    competencyId: "",
    text: "Essa pessoa manda bem em…",
    type: "texto_aberto",
    required: true,
    showFor: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"],
    showForModels: ["180", "270", "360"],
  },
  {
    id: "q_pode_melhorar",
    competencyId: "",
    text: "Essa pessoa pode melhorar os seguintes pontos…",
    type: "texto_aberto",
    required: true,
    showFor: ["autoavaliacao", "lider_liderado", "liderado_lider", "par"],
    showForModels: ["180", "270", "360"],
  },
  {
    id: "q_tipo_360",
    competencyId: "",
    text: "Caso esteja respondendo sobre alguém no modelo 360°: Qual o tipo dessa avaliação?",
    type: "sim_nao",
    required: false,
    showFor: ["liderado_lider", "par"],
    showForModels: ["360"],
  },
];

// ===== WEIGHTED AVERAGE CALCULATION =====
export function calculateWeightedAverage(
  scores: Record<EvaluationType, number[]>,
  weights: Record<EvaluationType, number>
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [type, typeScores] of Object.entries(scores)) {
    if (typeScores.length === 0) continue;
    const avg = typeScores.reduce((a, b) => a + b, 0) / typeScores.length;
    const w = weights[type as EvaluationType] || 0;
    weightedSum += avg * w;
    totalWeight += w;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
