import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { hubApi, type HubContent } from "@/lib/api";
import { BookOpen, Plus, Search, Video, Link, FileText, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Categorias do Hub conforme briefing
const CATEGORIES = [
  { id: "todos",           label: "Todos", icon: "📚" },
  { id: "cultura",         label: "Cultura & Valores", icon: "✨" },
  { id: "guia_clt",        label: "Guia CLT", icon: "📋" },
  { id: "guia_pj",         label: "Guia PJ", icon: "💼" },
  { id: "beneficios",      label: "Benefícios", icon: "🎁" },
  { id: "pagamento",       label: "Pagamento & Banco", icon: "💳" },
  { id: "ferias",          label: "Férias & Ausências", icon: "🌴" },
  { id: "carreira",        label: "Carreira & PDI", icon: "🚀" },
  { id: "processos",       label: "Processos & Ferramentas", icon: "⚙️" },
  { id: "onboarding",      label: "Onboarding", icon: "👋" },
  { id: "videos",          label: "Vídeos CEO & Cultura", icon: "🎥" },
];

const TYPE_ICON = {
  text:  <FileText className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  link:  <Link className="h-4 w-4" />,
  file:  <FileText className="h-4 w-4" />,
};

const TYPE_COLOR = {
  text:  "bg-primary/10 text-primary",
  video: "bg-fluency-pink/10 text-fluency-pink",
  link:  "bg-fluency-blue/10 text-fluency-blue",
  file:  "bg-fluency-orange/10 text-fluency-orange",
};

// Conteúdo padrão para demo
const DEFAULT_CONTENTS: Omit<HubContent, "id"|"createdAt"|"updatedAt">[] = [
  {
    title: "Bem-vindo à Fluency! 👋",
    category: "onboarding",
    type: "text",
    content: `# Bem-vindo à Fluency Academy!\n\nEstamos muito felizes em ter você aqui. A Fluency é uma EdTech focada em ensino de inglês, e nossa missão é transformar a vida das pessoas através do idioma.\n\n## Seus primeiros dias\n\n- **D+1**: Conheça o time e configure seu ambiente\n- **D+7**: Primeira 1:1 com seu gestor\n- **D+15**: Pesquisa de onboarding — sua opinião é essencial\n- **D+30**: Alinhamento de PDI e prioridades\n\n## Ferramentas que você vai usar\n\n- **Fluency Pathway** — esta plataforma\n- **Notion** — documentação e projetos\n- **Slack** — comunicação interna\n- **Google Workspace** — e-mail e colaboração`,
    audience: "todos",
    order: 0,
    createdBy: "sistema",
  },
  {
    title: "Valores Fluency — nosso jeito de ser",
    category: "cultura",
    type: "text",
    content: `# Valores Fluency\n\n## 1. Satisfação do Cliente em Primeiro Lugar\nTudo que fazemos começa e termina no cliente. Antes de qualquer decisão, perguntamos: isso serve ao cliente?\n\n## 2. Segurança é Inegociável\nCriamos um ambiente onde todos se sentem seguros para errar, aprender e crescer.\n\n## 3. Inovar com Simplicidade\nGrandes ideias não precisam ser complicadas. Buscamos soluções elegantes.\n\n## 4. Se Apaixonar Pelo Problema\nNão nos apaixonamos pela solução — nos apaixonamos pelo problema que queremos resolver.\n\n## 5. Gerar Valor Para o Nosso Ecossistema\nAlunos, professores, parceiros — todos ganham quando a Fluency cresce.\n\n## 6. Desafio é a Nossa Diversão\nNão fugimos de problemas difíceis. Eles nos motivam.`,
    audience: "todos",
    order: 1,
    createdBy: "sistema",
  },
  {
    title: "Guia de Férias — CLT",
    category: "guia_clt",
    type: "text",
    content: `# Férias — Colaboradores CLT\n\n## Direito\nTodo colaborador CLT tem direito a **30 dias de férias** por ano trabalhado.\n\n## Como solicitar\n1. Acesse **Engajar → Férias** no menu lateral\n2. Clique em **Solicitar**\n3. Escolha o período desejado\n4. Aguarde aprovação do gestor\n\n## Importante\n- Férias devem ser solicitadas com **30 dias de antecedência**\n- Podem ser divididas em até 3 períodos (mínimo 14 dias num deles)\n- Recesso coletivo de fim de ano é separado das férias individuais`,
    audience: "CLT",
    order: 2,
    createdBy: "sistema",
  },
  {
    title: "Guia de Recesso — PJ",
    category: "guia_pj",
    type: "text",
    content: `# Recesso — Colaboradores PJ\n\n## Como funciona\nColaboradores PJ têm **recesso coletivo** conforme calendário da empresa.\n\nO recesso individual é combinado diretamente com seu gestor e registrado na plataforma como **Day Off**.\n\n## Como registrar\n1. Acesse **Engajar → Férias**\n2. Selecione o tipo **Recesso** ou **Day Off**\n3. Informe o período\n\n## Recesso coletivo de fim de ano\nTodos os colaboradores (CLT e PJ) têm recesso coletivo. As datas são comunicadas pelo People até outubro de cada ano.`,
    audience: "PJ",
    order: 3,
    createdBy: "sistema",
  },
  {
    title: "Plataforma de e-mail e comunicação",
    category: "processos",
    type: "link",
    content: "https://mail.google.com",
    audience: "todos",
    order: 4,
    createdBy: "sistema",
  },
];

// ── Viewer de conteúdo ────────────────────────────────────────
function ContentViewer({ content, onClose }: { content: HubContent; onClose: () => void }) {
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.+)/gm, '<h3 style="font-size:14px;font-weight:600;margin:16px 0 6px;">$1</h3>')
      .replace(/^## (.+)/gm, '<h2 style="font-size:16px;font-weight:700;margin:20px 0 8px;">$1</h2>')
      .replace(/^# (.+)/gm, '<h1 style="font-size:20px;font-weight:800;margin:0 0 12px;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)/gm, '<li style="margin:4px 0;padding-left:4px;">$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li style="margin:4px 0;padding-left:4px;list-style-type:decimal;">$2</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[14px] font-semibold text-foreground">{content.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className={`text-[9px] border-0 ${TYPE_COLOR[content.type]}`}>
                {content.type}
              </Badge>
              {content.audience !== "todos" && (
                <Badge variant="outline" className="text-[9px]">{content.audience}</Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-[12px]" onClick={onClose}>← Voltar</Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {content.type === "text" && (
            <div
              className="prose prose-sm max-w-none text-foreground leading-relaxed"
              style={{ fontSize: "14px", lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content.content) }}
            />
          )}
          {content.type === "video" && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-[13px] text-muted-foreground">Player de vídeo disponível após integração com backend de mídia</p>
                  <a href={content.content} target="_blank" rel="noreferrer"
                    className="text-[12px] text-primary hover:underline mt-2 inline-flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Abrir link externo
                  </a>
                </div>
              </div>
            </div>
          )}
          {content.type === "link" && (
            <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
              <Link className="h-10 w-10 text-fluency-blue mx-auto" />
              <p className="text-[13px] text-muted-foreground break-all">{content.content}</p>
              <a href={content.content} target="_blank" rel="noreferrer">
                <Button className="gradient-brand text-white border-0 gap-1.5">
                  <ExternalLink className="h-4 w-4" /> Abrir link
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Formulário de novo conteúdo ───────────────────────────────
function ContentForm({ onSave, existing }: { onSave: () => void; existing?: HubContent }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState(existing?.category ?? "cultura");
  const [type, setType] = useState<HubContent["type"]>(existing?.type ?? "text");
  const [content, setContent] = useState(existing?.content ?? "");
  const [audience, setAudience] = useState<HubContent["audience"]>(existing?.audience ?? "todos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, category, type, content, audience, order: 0, createdBy: user?.name ?? "" };
    if (existing) {
      hubApi.update(existing.id, data);
    } else {
      hubApi.create(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[12px]">Título</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ex: Guia de férias 2026" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.filter(c => c.id !== "todos").map(c => (
                <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Público</Label>
          <Select value={audience} onValueChange={(v: any) => setAudience(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="CLT">Somente CLT</SelectItem>
              <SelectItem value="PJ">Somente PJ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">Tipo de conteúdo</Label>
        <div className="flex gap-2">
          {(["text","video","link","file"] as const).map(t => (
            <button type="button" key={t} onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-md text-[12px] font-medium border transition-all flex items-center justify-center gap-1.5 ${type === t ? "gradient-brand text-white border-transparent" : "bg-background border-border text-muted-foreground"}`}>
              {TYPE_ICON[t]} {t}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[12px]">
          {type === "text" ? "Conteúdo (Markdown)" : type === "link" || type === "video" ? "URL" : "Conteúdo"}
        </Label>
        {type === "text" ? (
          <Textarea rows={10} value={content} onChange={e => setContent(e.target.value)}
            placeholder="# Título&#10;&#10;Escreva o conteúdo aqui em Markdown..." className="font-mono text-[12px]" />
        ) : (
          <Input value={content} onChange={e => setContent(e.target.value)} placeholder="https://..." />
        )}
        {type === "text" && (
          <p className="text-[10px] text-muted-foreground">Suporta Markdown: **negrito**, *itálico*, # títulos, - listas</p>
        )}
      </div>
      <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={!title || !content}>
        {existing ? "Salvar alterações" : "Publicar conteúdo"}
      </Button>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function HubCulturalPage() {
  const { isAdmin, user } = useAuth();
  const [contents, setContents] = useState<HubContent[]>([]);
  const [category, setCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HubContent | null>(null);
  const [viewing, setViewing] = useState<HubContent | null>(null);

  useEffect(() => { refresh(); }, []);

  const refresh = () => {
    let data = hubApi.getAll();
    // Seed com conteúdo padrão se vazio
    if (data.length === 0) {
      DEFAULT_CONTENTS.forEach(c => hubApi.create(c));
      data = hubApi.getAll();
    }
    setContents(data);
  };

  const handleDelete = (id: string) => {
    hubApi.delete(id);
    refresh();
    toast.success("Conteúdo removido.");
  };

  const filtered = contents.filter(c => {
    const matchCat = category === "todos" || c.category === category;
    const matchSearch = search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const countByCategory = (cat: string) =>
    contents.filter(c => cat === "todos" ? true : c.category === cat).length;

  if (viewing) {
    return <ContentViewer content={viewing} onClose={() => setViewing(null)} />;
  }

  return (
    <>
      <PageHeader title="Hub Cultural" subtitle="Base de conhecimento, guias e conteúdos da Fluency">
        {isAdmin && (
          <Dialog open={open || !!editing} onOpenChange={v => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Novo conteúdo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editing ? "Editar conteúdo" : "Publicar novo conteúdo"}</DialogTitle></DialogHeader>
              <ContentForm existing={editing ?? undefined} onSave={() => {
                setOpen(false); setEditing(null); refresh();
                toast.success(editing ? "Conteúdo atualizado!" : "Conteúdo publicado!");
              }} />
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <div className="flex gap-6">
        {/* Sidebar de categorias */}
        <div className="w-48 shrink-0">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Categorias</p>
          <div className="space-y-0.5">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center justify-between rounded-md px-2.5 py-2 text-[12px] font-medium transition-colors ${category === cat.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                <span className="flex items-center gap-2">
                  <span style={{ fontSize: "14px" }}>{cat.icon}</span>
                  {cat.label}
                </span>
                <span className="text-[10px]">{countByCategory(cat.id)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Buscar conteúdo..." value={search}
              onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-[13px]" />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-[13px] text-muted-foreground">Nenhum conteúdo encontrado</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {filtered.sort((a, b) => a.order - b.order).map(c => {
                const catInfo = CATEGORIES.find(cat => cat.id === c.category);
                return (
                  <div key={c.id}
                    className="group rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors cursor-pointer"
                    onClick={() => setViewing(c)}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${TYPE_COLOR[c.type]}`}>
                        {TYPE_ICON[c.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {c.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {catInfo && (
                            <span className="text-[10px] text-muted-foreground">{catInfo.icon} {catInfo.label}</span>
                          )}
                          {c.audience !== "todos" && (
                            <Badge variant="outline" className="text-[9px]">{c.audience}</Badge>
                          )}
                        </div>
                        {c.type === "text" && (
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                            {c.content.replace(/[#*`]/g, "").slice(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Admin actions */}
                    {isAdmin && (
                      <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end"
                        onClick={e => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                          onClick={() => setEditing(c)}>
                          <Edit className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                          onClick={() => handleDelete(c.id)}>
                          <Trash2 className="h-3 w-3 text-destructive/60" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
