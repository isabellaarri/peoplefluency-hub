// ============================================================
// Fluency Pathway — API Layer
//
// Todas as funções aqui são substituíveis por chamadas reais.
// Para migrar para backend (Supabase, Railway, etc.):
//   1. Troque getLocal/setLocal por fetch() ou supabase.from()
//   2. Mantenha as assinaturas iguais — as páginas não mudam
//   3. Adicione loading/error states nos componentes
// ============================================================

// ── Local storage helpers (remover ao migrar) ────────────────
function getLocal<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(`fluency_${key}`) || "[]"); }
  catch { return []; }
}
function setLocal<T>(key: string, data: T[]) {
  localStorage.setItem(`fluency_${key}`, JSON.stringify(data));
}
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Types ─────────────────────────────────────────────────────

export type ContractType = "CLT" | "PJ";
export type UserRole = "admin" | "leader" | "collaborator";

export interface AdmissionRecord {
  id: string;
  // Dados da vaga
  contractType: ContractType;
  workSchedule: string;
  monthlyHours: number;
  probationPeriod: 15 | 30 | 45 | 60 | null;
  firstJob: boolean;
  managerId: string;
  managerName: string;
  matricula: string;
  startDate: string;
  // Dados pessoais
  fullName: string;
  socialName: string;
  nationality: string;
  birthCity: string;
  birthState: string;
  race: string;
  gender: string;
  civilStatus: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  shirtSize: string;
  foodRestrictions: string;
  celebratesEvents: boolean;
  disability: boolean;
  disabilityType: string;
  disabilityNotes: string;
  // Formação
  education: string;
  institution: string;
  course: string;
  graduationYear: string;
  // Endereço
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  // Contatos
  phone: string;
  mobile: string;
  personalEmail: string;
  corporateEmail: string;
  emergencyContacts: EmergencyContact[];
  // Dependentes
  dependents: Dependent[];
  // Bancário
  bank: string;
  agency: string;
  account: string;
  // PJ extra (condicional)
  companyName: string;
  cnpj: string;
  companyAddress: string;
  companySize: string;
  cnae: string;
  legalNature: string;
  // Status do processo
  status: "aguardando_preenchimento" | "preenchido" | "conferencia_rh" | "preenchimento_rh" | "concluido";
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Dependent {
  name: string;
  relationship: string;
  birthDate: string;
  gender: string;
  education: string;
  cpf: string;
  hasDisability: boolean;
  irDependent: boolean;
}

export interface OneOnOneRecord {
  id: string;
  date: string;
  leaderId: string;
  leaderName: string;
  collaboratorId: string;
  collaboratorName: string;
  type: string;
  duration: string;
  recurrence: string;
  topics: string[];
  sharedNotes: string;
  privateNotes: string;
  actionItems: string[];
  pdiTasks: PDITaskFromOneOnOne[];
  mood: number;
  status: "agendada" | "realizada" | "cancelada";
  createdBy: string;
}

export interface PDITaskFromOneOnOne {
  title: string;
  competency: string;
  type: "70" | "20" | "10";
  deadline: string;
  addedToPdi: boolean;
}

export interface FeedbackRecord {
  id: string;
  date: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  type: "situacao" | "comportamento" | "consequencia" | "sugestao";
  situation: string;
  behavior: string;
  consequence: string;
  suggestion: string;
  visibility: "privado" | "publico_lider";
  read: boolean;
}

export interface SentimentRecord {
  id: string;
  date: string;
  userId: string;
  userName: string;
  departamento: string;
  time: string;
  score: number;
  comment: string;
  tags: string[];
}

export interface PDIRecord {
  id: string;
  userId: string;
  userName: string;
  title: string;
  competency: string;
  type: "70" | "20" | "10";
  description: string;
  deadline: string;
  status: "em_andamento" | "concluido" | "atrasado" | "nao_iniciado";
  progress: number;
  fromOneOnOneId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyDelivery {
  id: string;
  userId: string;
  userName: string;
  weekStart: string;
  description: string;
  loopValorStage: string;
  fluencyValue: string;
  status: "entregue" | "em_andamento" | "pendente";
  createdAt: string;
}

export interface VacationRecord {
  id: string;
  userId: string;
  userName: string;
  type: "ferias" | "recesso" | "day_off" | "licenca";
  startDate: string;
  endDate: string;
  days: number;
  status: "aprovada" | "pendente" | "rejeitada" | "em_gozo";
  notes: string;
  approvedBy: string;
  createdAt: string;
}

export interface SurveyRecord {
  id: string;
  title: string;
  description: string;
  type: "clima" | "pulso" | "enps" | "onboarding" | "offboarding" | "custom";
  status: "rascunho" | "ativa" | "encerrada";
  questions: SurveyQuestion[];
  targetAudience: "todos" | "time" | "departamento";
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: "escala" | "texto" | "multipla_escolha" | "sim_nao" | "nps";
  options?: string[];
  required: boolean;
  conditionalOn?: { questionId: string; answer: string };
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  userName: string;
  answers: Record<string, string | number>;
  anonymous: boolean;
  submittedAt: string;
}

export interface WeeklyPriority {
  id: string;
  userId: string;
  userName: string;
  weekStart: string;
  priorities: { text: string; loopStage: string; completed: boolean }[];
  reflection: string;
  createdAt: string;
}

export interface HubContent {
  id: string;
  title: string;
  category: string;
  type: "text" | "video" | "link" | "file";
  content: string;       // markdown text or URL
  audience: "todos" | "CLT" | "PJ";
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgOverride {
  id: string;
  userId: string;
  overrideManagerId: string;
  overrideManagerName: string;
  context: "pesquisas" | "avaliacoes" | "one_on_one" | "todos";
  createdBy: string;
  createdAt: string;
}

export interface OffboardingRecord {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  cargo: string;
  departamento: string;
  contractType: ContractType;
  reason: string;
  terminationDate: string;
  lastDay: string;
  status: "dados_iniciais" | "aguardando_contabilidade" | "retorno_contabilidade" | "concluido";
  surveyEmailSent: boolean;
  surveyAnswered: boolean;
  notes: string;
  createdAt: string;
}

// ── API Functions ─────────────────────────────────────────────
// TODO: replace each function body with real API calls
// Example for Supabase:
//   return supabase.from('one_on_ones').select('*')
// Example for REST:
//   return fetch('/api/one-on-ones').then(r => r.json())

// === ADMISSION ===
export const admissionApi = {
  // TODO: GET /api/admissions
  getAll: (): AdmissionRecord[] => getLocal("admissions"),
  getById: (id: string) => getLocal<AdmissionRecord>("admissions").find(r => r.id === id) ?? null,
  getByStatus: (status: AdmissionRecord["status"]) =>
    getLocal<AdmissionRecord>("admissions").filter(r => r.status === status),
  // TODO: POST /api/admissions
  create: (data: Omit<AdmissionRecord, "id" | "createdAt" | "updatedAt">): AdmissionRecord => {
    const records = getLocal<AdmissionRecord>("admissions");
    const record: AdmissionRecord = {
      ...data,
      id: genId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocal("admissions", [...records, record]);
    return record;
  },
  // TODO: PATCH /api/admissions/:id
  update: (id: string, data: Partial<AdmissionRecord>) => {
    const records = getLocal<AdmissionRecord>("admissions").map(r =>
      r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
    );
    setLocal("admissions", records);
  },
  // TODO: DELETE /api/admissions/:id
  delete: (id: string) =>
    setLocal("admissions", getLocal<AdmissionRecord>("admissions").filter(r => r.id !== id)),
};

// === ONE ON ONE ===
export const oneOnOneApi = {
  // TODO: GET /api/one-on-ones
  getAll: (): OneOnOneRecord[] => getLocal("one_on_ones"),
  getByUser: (userId: string) =>
    getLocal<OneOnOneRecord>("one_on_ones").filter(r =>
      r.collaboratorId === userId || r.leaderId === userId
    ),
  getByLeader: (leaderId: string) =>
    getLocal<OneOnOneRecord>("one_on_ones").filter(r => r.leaderId === leaderId),
  // TODO: POST /api/one-on-ones
  create: (data: Omit<OneOnOneRecord, "id">): OneOnOneRecord => {
    const records = getLocal<OneOnOneRecord>("one_on_ones");
    const record = { ...data, id: genId() };
    setLocal("one_on_ones", [...records, record]);
    return record;
  },
  // TODO: PATCH /api/one-on-ones/:id
  update: (id: string, data: Partial<OneOnOneRecord>) => {
    setLocal("one_on_ones",
      getLocal<OneOnOneRecord>("one_on_ones").map(r => r.id === id ? { ...r, ...data } : r)
    );
  },
  // TODO: DELETE /api/one-on-ones/:id
  delete: (id: string) =>
    setLocal("one_on_ones", getLocal<OneOnOneRecord>("one_on_ones").filter(r => r.id !== id)),
};

// === FEEDBACK ===
export const feedbackApi = {
  getAll: (): FeedbackRecord[] => getLocal("feedbacks"),
  getReceived: (userId: string) =>
    getLocal<FeedbackRecord>("feedbacks").filter(r => r.toId === userId),
  getSent: (userId: string) =>
    getLocal<FeedbackRecord>("feedbacks").filter(r => r.fromId === userId),
  // TODO: POST /api/feedbacks
  create: (data: Omit<FeedbackRecord, "id">): FeedbackRecord => {
    const records = getLocal<FeedbackRecord>("feedbacks");
    const record = { ...data, id: genId() };
    setLocal("feedbacks", [...records, record]);
    return record;
  },
  markRead: (id: string) => {
    setLocal("feedbacks",
      getLocal<FeedbackRecord>("feedbacks").map(r => r.id === id ? { ...r, read: true } : r)
    );
  },
};

// === SENTIMENTOS ===
export const sentimentApi = {
  getAll: (): SentimentRecord[] => getLocal("sentiments"),
  getByUser: (userId: string) =>
    getLocal<SentimentRecord>("sentiments").filter(r => r.userId === userId),
  // TODO: POST /api/sentiments
  create: (data: Omit<SentimentRecord, "id">): SentimentRecord => {
    const records = getLocal<SentimentRecord>("sentiments");
    const record = { ...data, id: genId() };
    setLocal("sentiments", [...records, record]);
    return record;
  },
};

// === PDI ===
export const pdiApi = {
  getAll: (): PDIRecord[] => getLocal("pdis"),
  getByUser: (userId: string) =>
    getLocal<PDIRecord>("pdis").filter(r => r.userId === userId),
  // TODO: POST /api/pdis
  create: (data: Omit<PDIRecord, "id">): PDIRecord => {
    const records = getLocal<PDIRecord>("pdis");
    const record = { ...data, id: genId() };
    setLocal("pdis", [...records, record]);
    return record;
  },
  // TODO: PATCH /api/pdis/:id
  update: (id: string, data: Partial<PDIRecord>) => {
    setLocal("pdis",
      getLocal<PDIRecord>("pdis").map(r =>
        r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
      )
    );
  },
  delete: (id: string) =>
    setLocal("pdis", getLocal<PDIRecord>("pdis").filter(r => r.id !== id)),
};

// === ENTREGAS ===
export const deliveryApi = {
  getAll: (): WeeklyDelivery[] => getLocal("deliveries"),
  getByUser: (userId: string) =>
    getLocal<WeeklyDelivery>("deliveries").filter(r => r.userId === userId),
  create: (data: Omit<WeeklyDelivery, "id">): WeeklyDelivery => {
    const records = getLocal<WeeklyDelivery>("deliveries");
    const record = { ...data, id: genId() };
    setLocal("deliveries", [...records, record]);
    return record;
  },
};

// === FÉRIAS ===
export const vacationApi = {
  getAll: (): VacationRecord[] => getLocal("vacations"),
  getByUser: (userId: string) =>
    getLocal<VacationRecord>("vacations").filter(r => r.userId === userId),
  create: (data: Omit<VacationRecord, "id">): VacationRecord => {
    const records = getLocal<VacationRecord>("vacations");
    const record = { ...data, id: genId() };
    setLocal("vacations", [...records, record]);
    return record;
  },
  update: (id: string, data: Partial<VacationRecord>) => {
    setLocal("vacations",
      getLocal<VacationRecord>("vacations").map(r => r.id === id ? { ...r, ...data } : r)
    );
  },
  delete: (id: string) =>
    setLocal("vacations", getLocal<VacationRecord>("vacations").filter(r => r.id !== id)),
};

// === PESQUISAS ===
export const surveyApi = {
  getAll: (): SurveyRecord[] => getLocal("surveys"),
  getActive: () => getLocal<SurveyRecord>("surveys").filter(r => r.status === "ativa"),
  create: (data: Omit<SurveyRecord, "id">): SurveyRecord => {
    const records = getLocal<SurveyRecord>("surveys");
    const record = { ...data, id: genId() };
    setLocal("surveys", [...records, record]);
    return record;
  },
  update: (id: string, data: Partial<SurveyRecord>) => {
    setLocal("surveys",
      getLocal<SurveyRecord>("surveys").map(r => r.id === id ? { ...r, ...data } : r)
    );
  },
  delete: (id: string) =>
    setLocal("surveys", getLocal<SurveyRecord>("surveys").filter(r => r.id !== id)),
};

export const surveyResponseApi = {
  getAll: (): SurveyResponse[] => getLocal("survey_responses"),
  getBySurvey: (surveyId: string) =>
    getLocal<SurveyResponse>("survey_responses").filter(r => r.surveyId === surveyId),
  getByUser: (userId: string) =>
    getLocal<SurveyResponse>("survey_responses").filter(r => r.userId === userId),
  create: (data: Omit<SurveyResponse, "id">): SurveyResponse => {
    const records = getLocal<SurveyResponse>("survey_responses");
    const record = { ...data, id: genId() };
    setLocal("survey_responses", [...records, record]);
    return record;
  },
};

// === PRIORIDADES ===
export const priorityApi = {
  getAll: (): WeeklyPriority[] => getLocal("priorities"),
  getByUser: (userId: string) =>
    getLocal<WeeklyPriority>("priorities").filter(r => r.userId === userId),
  getCurrentWeek: (userId: string) => {
    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const weekStart = monday.toISOString().split("T")[0];
    return getLocal<WeeklyPriority>("priorities")
      .find(r => r.userId === userId && r.weekStart === weekStart) ?? null;
  },
  create: (data: Omit<WeeklyPriority, "id">): WeeklyPriority => {
    const records = getLocal<WeeklyPriority>("priorities");
    const record = { ...data, id: genId() };
    setLocal("priorities", [...records, record]);
    return record;
  },
  update: (id: string, data: Partial<WeeklyPriority>) => {
    setLocal("priorities",
      getLocal<WeeklyPriority>("priorities").map(r => r.id === id ? { ...r, ...data } : r)
    );
  },
};

// === HUB CULTURAL ===
export const hubApi = {
  getAll: (): HubContent[] => getLocal("hub_contents"),
  getByCategory: (category: string) =>
    getLocal<HubContent>("hub_contents").filter(r => r.category === category),
  getByAudience: (audience: "CLT" | "PJ") =>
    getLocal<HubContent>("hub_contents").filter(r =>
      r.audience === "todos" || r.audience === audience
    ),
  // TODO: POST /api/hub-contents
  create: (data: Omit<HubContent, "id" | "createdAt" | "updatedAt">): HubContent => {
    const records = getLocal<HubContent>("hub_contents");
    const record: HubContent = {
      ...data,
      id: genId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocal("hub_contents", [...records, record]);
    return record;
  },
  update: (id: string, data: Partial<HubContent>) => {
    setLocal("hub_contents",
      getLocal<HubContent>("hub_contents").map(r =>
        r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
      )
    );
  },
  delete: (id: string) =>
    setLocal("hub_contents", getLocal<HubContent>("hub_contents").filter(r => r.id !== id)),
};

// === ORGANOGRAMA — OVERRIDES ===
export const orgApi = {
  getAll: (): OrgOverride[] => getLocal("org_overrides"),
  getByUser: (userId: string) =>
    getLocal<OrgOverride>("org_overrides").filter(r => r.userId === userId),
  // TODO: POST /api/org-overrides
  create: (data: Omit<OrgOverride, "id" | "createdAt">): OrgOverride => {
    const records = getLocal<OrgOverride>("org_overrides");
    const record: OrgOverride = {
      ...data,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    setLocal("org_overrides", [...records, record]);
    return record;
  },
  delete: (id: string) =>
    setLocal("org_overrides", getLocal<OrgOverride>("org_overrides").filter(r => r.id !== id)),
};

// === OFFBOARDING ===
export const offboardingApi = {
  getAll: (): OffboardingRecord[] => getLocal("offboardings"),
  getById: (id: string) =>
    getLocal<OffboardingRecord>("offboardings").find(r => r.id === id) ?? null,
  create: (data: Omit<OffboardingRecord, "id" | "createdAt">): OffboardingRecord => {
    const records = getLocal<OffboardingRecord>("offboardings");
    const record: OffboardingRecord = {
      ...data, id: genId(), createdAt: new Date().toISOString(),
    };
    setLocal("offboardings", [...records, record]);
    return record;
  },
  update: (id: string, data: Partial<OffboardingRecord>) => {
    setLocal("offboardings",
      getLocal<OffboardingRecord>("offboardings").map(r => r.id === id ? { ...r, ...data } : r)
    );
  },
};

// ── Backward-compat re-exports so existing pages keep working ─
// Remove after migrating all pages to use api.ts directly
export const oneOnOneStore = {
  getAll: oneOnOneApi.getAll,
  getByUser: oneOnOneApi.getByUser,
  getByLeader: oneOnOneApi.getByLeader,
  create: (data: any) => oneOnOneApi.create({
    ...data,
    type: data.type ?? "livre",
    duration: data.duration ?? "45 min",
    recurrence: data.recurrence ?? "única",
    sharedNotes: data.notes ?? "",
    privateNotes: "",
    pdiTasks: [],
  }),
  update: oneOnOneApi.update,
  delete: oneOnOneApi.delete,
};
export const feedbackStore  = { ...feedbackApi,  getAll: feedbackApi.getAll };
export const sentimentStore = { ...sentimentApi, getAll: sentimentApi.getAll, getByTeam: (t: string) => sentimentApi.getAll().filter((r: SentimentRecord) => r.time === t) };
export const pdiStore       = { ...pdiApi };
export const deliveryStore  = { ...deliveryApi };
export const vacationStore  = { ...vacationApi };
export const surveyStore    = { ...surveyApi };
export const surveyResponseStore = { ...surveyResponseApi };
export const priorityStore  = { ...priorityApi };

// ── Export to Excel helper ────────────────────────────────────
// TODO: replace with server-side export endpoint for large datasets
export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return "";
      const str = typeof val === "object" ? JSON.stringify(val) : String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export function exportAllData(label: string) {
  const timestamp = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
  exportToCSV(sentimentApi.getAll(),       `${label}_sentimentos_${timestamp}`);
  exportToCSV(pdiApi.getAll(),             `${label}_pdis_${timestamp}`);
  exportToCSV(oneOnOneApi.getAll(),        `${label}_1on1s_${timestamp}`);
  exportToCSV(vacationApi.getAll(),        `${label}_ferias_${timestamp}`);
  exportToCSV(surveyResponseApi.getAll(),  `${label}_pesquisas_${timestamp}`);
  exportToCSV(priorityApi.getAll(),        `${label}_prioridades_${timestamp}`);
}
