// Local data store that persists to localStorage
// Designed to be easily replaced with API calls later

export interface OneOnOneRecord {
  id: string;
  date: string;
  leaderId: string;
  leaderName: string;
  collaboratorId: string;
  collaboratorName: string;
  topics: string[];
  notes: string;
  actionItems: string[];
  mood: number;
  status: "agendada" | "realizada" | "cancelada";
  createdBy: string;
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
  type: "clima" | "pulso" | "enps" | "custom";
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
  type: "escala" | "texto" | "multipla_escolha" | "sim_nao";
  options?: string[];
  required: boolean;
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

function getStore<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(`fluency_${key}`);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(`fluency_${key}`, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// === ONE ON ONE ===
export const oneOnOneStore = {
  getAll: () => getStore<OneOnOneRecord>("one_on_ones"),
  getByUser: (userId: string) => getStore<OneOnOneRecord>("one_on_ones").filter(r => r.collaboratorId === userId || r.leaderId === userId),
  getByLeader: (leaderId: string) => getStore<OneOnOneRecord>("one_on_ones").filter(r => r.leaderId === leaderId),
  create: (data: Omit<OneOnOneRecord, "id">) => {
    const records = getStore<OneOnOneRecord>("one_on_ones");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("one_on_ones", records);
    return newRecord;
  },
  update: (id: string, data: Partial<OneOnOneRecord>) => {
    const records = getStore<OneOnOneRecord>("one_on_ones");
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) { records[idx] = { ...records[idx], ...data }; setStore("one_on_ones", records); }
    return records[idx];
  },
  delete: (id: string) => {
    setStore("one_on_ones", getStore<OneOnOneRecord>("one_on_ones").filter(r => r.id !== id));
  },
};

// === FEEDBACK ===
export const feedbackStore = {
  getAll: () => getStore<FeedbackRecord>("feedbacks"),
  getReceived: (userId: string) => getStore<FeedbackRecord>("feedbacks").filter(r => r.toId === userId),
  getSent: (userId: string) => getStore<FeedbackRecord>("feedbacks").filter(r => r.fromId === userId),
  create: (data: Omit<FeedbackRecord, "id">) => {
    const records = getStore<FeedbackRecord>("feedbacks");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("feedbacks", records);
    return newRecord;
  },
  markRead: (id: string) => {
    const records = getStore<FeedbackRecord>("feedbacks");
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) { records[idx].read = true; setStore("feedbacks", records); }
  },
};

// === SENTIMENTOS ===
export const sentimentStore = {
  getAll: () => getStore<SentimentRecord>("sentiments"),
  getByUser: (userId: string) => getStore<SentimentRecord>("sentiments").filter(r => r.userId === userId),
  getByTeam: (time: string) => getStore<SentimentRecord>("sentiments").filter(r => r.time === time),
  create: (data: Omit<SentimentRecord, "id">) => {
    const records = getStore<SentimentRecord>("sentiments");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("sentiments", records);
    return newRecord;
  },
};

// === PDI ===
export const pdiStore = {
  getAll: () => getStore<PDIRecord>("pdis"),
  getByUser: (userId: string) => getStore<PDIRecord>("pdis").filter(r => r.userId === userId),
  create: (data: Omit<PDIRecord, "id">) => {
    const records = getStore<PDIRecord>("pdis");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("pdis", records);
    return newRecord;
  },
  update: (id: string, data: Partial<PDIRecord>) => {
    const records = getStore<PDIRecord>("pdis");
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) { records[idx] = { ...records[idx], ...data }; setStore("pdis", records); }
    return records[idx];
  },
  delete: (id: string) => {
    setStore("pdis", getStore<PDIRecord>("pdis").filter(r => r.id !== id));
  },
};

// === ENTREGAS SEMANAIS ===
export const deliveryStore = {
  getAll: () => getStore<WeeklyDelivery>("deliveries"),
  getByUser: (userId: string) => getStore<WeeklyDelivery>("deliveries").filter(r => r.userId === userId),
  create: (data: Omit<WeeklyDelivery, "id">) => {
    const records = getStore<WeeklyDelivery>("deliveries");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("deliveries", records);
    return newRecord;
  },
};

// === FÉRIAS / RECESSO ===
export const vacationStore = {
  getAll: () => getStore<VacationRecord>("vacations"),
  getByUser: (userId: string) => getStore<VacationRecord>("vacations").filter(r => r.userId === userId),
  create: (data: Omit<VacationRecord, "id">) => {
    const records = getStore<VacationRecord>("vacations");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("vacations", records);
    return newRecord;
  },
  update: (id: string, data: Partial<VacationRecord>) => {
    const records = getStore<VacationRecord>("vacations");
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) { records[idx] = { ...records[idx], ...data }; setStore("vacations", records); }
    return records[idx];
  },
  delete: (id: string) => {
    setStore("vacations", getStore<VacationRecord>("vacations").filter(r => r.id !== id));
  },
};

// === PESQUISAS ===
export const surveyStore = {
  getAll: () => getStore<SurveyRecord>("surveys"),
  getActive: () => getStore<SurveyRecord>("surveys").filter(r => r.status === "ativa"),
  create: (data: Omit<SurveyRecord, "id">) => {
    const records = getStore<SurveyRecord>("surveys");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("surveys", records);
    return newRecord;
  },
  update: (id: string, data: Partial<SurveyRecord>) => {
    const records = getStore<SurveyRecord>("surveys");
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) { records[idx] = { ...records[idx], ...data }; setStore("surveys", records); }
    return records[idx];
  },
  delete: (id: string) => {
    setStore("surveys", getStore<SurveyRecord>("surveys").filter(r => r.id !== id));
  },
};

export const surveyResponseStore = {
  getAll: () => getStore<SurveyResponse>("survey_responses"),
  getBySurvey: (surveyId: string) => getStore<SurveyResponse>("survey_responses").filter(r => r.surveyId === surveyId),
  getByUser: (userId: string) => getStore<SurveyResponse>("survey_responses").filter(r => r.userId === userId),
  create: (data: Omit<SurveyResponse, "id">) => {
    const records = getStore<SurveyResponse>("survey_responses");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("survey_responses", records);
    return newRecord;
  },
};

// === PRIORIDADES SEMANAIS ===
export const priorityStore = {
  getAll: () => getStore<WeeklyPriority>("priorities"),
  getByUser: (userId: string) => getStore<WeeklyPriority>("priorities").filter(r => r.userId === userId),
  getCurrentWeek: (userId: string) => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const weekStart = monday.toISOString().split("T")[0];
    return getStore<WeeklyPriority>("priorities").find(r => r.userId === userId && r.weekStart === weekStart);
  },
  create: (data: Omit<WeeklyPriority, "id">) => {
    const records = getStore<WeeklyPriority>("priorities");
    const newRecord = { ...data, id: generateId() };
    records.push(newRecord);
    setStore("priorities", records);
    return newRecord;
  },
  update: (id: string, data: Partial<WeeklyPriority>) => {
    const records = getStore<WeeklyPriority>("priorities");
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) { records[idx] = { ...records[idx], ...data }; setStore("priorities", records); }
    return records[idx];
  },
};
