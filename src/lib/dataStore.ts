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
  mood: number; // 1-5
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
  type: "situacao" | "comportamento" | "consequencia" | "sugestao"; // SCCS
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
  score: number; // 1-5
  comment: string;
  tags: string[];
}

export interface PDIRecord {
  id: string;
  userId: string;
  userName: string;
  title: string;
  competency: string;
  type: "70" | "20" | "10"; // 70-20-10
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
    const records = getStore<OneOnOneRecord>("one_on_ones").filter(r => r.id !== id);
    setStore("one_on_ones", records);
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
