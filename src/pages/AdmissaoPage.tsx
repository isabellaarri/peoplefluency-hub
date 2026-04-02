import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { admissionApi, type AdmissionRecord, type EmergencyContact, type Dependent } from "@/lib/api";
import { UserPlus, Plus, Clock, CheckCircle2, AlertCircle, FileText, Users, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  aguardando_preenchimento: { label: "Aguardando preenchimento", color: "text-muted-foreground bg-muted", icon: Clock, step: 1 },
  preenchido:              { label: "Preenchido pelo colaborador", color: "text-fluency-blue bg-fluency-blue/10", icon: FileText, step: 2 },
  conferencia_rh:          { label: "Conferência RH", color: "text-fluency-orange bg-fluency-orange/10", icon: AlertCircle, step: 3 },
  preenchimento_rh:        { label: "Preenchimento manual RH", color: "text-primary bg-primary/10", icon: FileText, step: 4 },
  concluido:               { label: "Concluído → Base", color: "text-fluency-green bg-fluency-green/10", icon: CheckCircle2, step: 5 },
};
const statusOrder = Object.keys(statusConfig) as AdmissionRecord["status"][];

// ── Seção colapsável ──────────────────────────────────────────
function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-border pt-4 space-y-3">{children}</div>}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px]">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      {children}
    </div>
  );
}

// ── Formulário de admissão ────────────────────────────────────
function AdmissaoForm({ onSave, existing }: { onSave: () => void; existing?: AdmissionRecord }) {
  const { user, allUsers } = useAuth();

  // Vaga
  const [contractType, setContractType] = useState<"CLT"|"PJ">(existing?.contractType ?? "CLT");
  const [workSchedule, setWorkSchedule] = useState(existing?.workSchedule ?? "");
  const [monthlyHours, setMonthlyHours] = useState(existing?.monthlyHours ?? 220);
  const [probationPeriod, setProbationPeriod] = useState<any>(existing?.probationPeriod ?? "");
  const [firstJob, setFirstJob] = useState(existing?.firstJob ?? false);
  const [managerId, setManagerId] = useState(existing?.managerId ?? "");
  const [matricula, setMatricula] = useState(existing?.matricula ?? "");
  const [startDate, setStartDate] = useState(existing?.startDate ?? "");

  // Pessoal
  const [fullName, setFullName] = useState(existing?.fullName ?? "");
  const [socialName, setSocialName] = useState(existing?.socialName ?? "");
  const [birthDate, setBirthDate] = useState(existing?.birthDate ?? "");
  const [gender, setGender] = useState(existing?.gender ?? "");
  const [race, setRace] = useState(existing?.race ?? "");
  const [civilStatus, setCivilStatus] = useState(existing?.civilStatus ?? "");
  const [nationality, setNationality] = useState(existing?.nationality ?? "Brasil");
  const [birthCity, setBirthCity] = useState(existing?.birthCity ?? "");
  const [birthState, setBirthState] = useState(existing?.birthState ?? "");
  const [motherName, setMotherName] = useState(existing?.motherName ?? "");
  const [fatherName, setFatherName] = useState(existing?.fatherName ?? "");
  const [shirtSize, setShirtSize] = useState(existing?.shirtSize ?? "");
  const [foodRestrictions, setFoodRestrictions] = useState(existing?.foodRestrictions ?? "");
  const [celebratesEvents, setCelebratesEvents] = useState(existing?.celebratesEvents ?? true);
  const [disability, setDisability] = useState(existing?.disability ?? false);
  const [disabilityType, setDisabilityType] = useState(existing?.disabilityType ?? "");
  const [disabilityNotes, setDisabilityNotes] = useState(existing?.disabilityNotes ?? "");

  // Formação
  const [education, setEducation] = useState(existing?.education ?? "");
  const [institution, setInstitution] = useState(existing?.institution ?? "");
  const [course, setCourse] = useState(existing?.course ?? "");
  const [graduationYear, setGraduationYear] = useState(existing?.graduationYear ?? "");

  // Endereço
  const [cep, setCep] = useState(existing?.cep ?? "");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [number, setNumber] = useState(existing?.number ?? "");
  const [complement, setComplement] = useState(existing?.complement ?? "");
  const [neighborhood, setNeighborhood] = useState(existing?.neighborhood ?? "");
  const [city, setCity] = useState(existing?.city ?? "");
  const [state, setState] = useState(existing?.state ?? "");
  const [country, setCountry] = useState(existing?.country ?? "Brasil");
  const [mobile, setMobile] = useState(existing?.mobile ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [personalEmail, setPersonalEmail] = useState(existing?.personalEmail ?? "");
  const [corporateEmail, setCorporateEmail] = useState(existing?.corporateEmail ?? "");

  // Contatos de emergência
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(
    existing?.emergencyContacts ?? [{ name: "", relationship: "", phone: "", email: "" }]
  );

  // Dependentes
  const [dependents, setDependents] = useState<Dependent[]>(existing?.dependents ?? []);

  // Bancário
  const [bank, setBank] = useState(existing?.bank ?? "");
  const [agency, setAgency] = useState(existing?.agency ?? "");
  const [account, setAccount] = useState(existing?.account ?? "");

  // PJ
  const [companyName, setCompanyName] = useState(existing?.companyName ?? "");
  const [cnpj, setCnpj] = useState(existing?.cnpj ?? "");
  const [companyAddress, setCompanyAddress] = useState(existing?.companyAddress ?? "");
  const [companySize, setCompanySize] = useState(existing?.companySize ?? "");
  const [cnae, setCnae] = useState(existing?.cnae ?? "");
  const [legalNature, setLegalNature] = useState(existing?.legalNature ?? "");

  const managerUser = allUsers.find(u => u.id === managerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      contractType, workSchedule, monthlyHours, probationPeriod: probationPeriod || null,
      firstJob, managerId, managerName: managerUser?.name ?? "", matricula, startDate,
      fullName, socialName, nationality, birthCity, birthState, race, gender, civilStatus,
      birthDate, motherName, fatherName, shirtSize, foodRestrictions, celebratesEvents,
      disability, disabilityType, disabilityNotes,
      education, institution, course, graduationYear,
      cep, address, number, complement, neighborhood, city, state, country,
      phone, mobile, personalEmail, corporateEmail,
      emergencyContacts, dependents,
      bank, agency, account,
      companyName, cnpj, companyAddress, companySize, cnae, legalNature,
      status: "aguardando_preenchimento" as const,
    };
    if (existing) {
      admissionApi.update(existing.id, data);
    } else {
      admissionApi.create(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">

      {/* Tipo de contrato — muda campos */}
      <div className="flex gap-2 p-3 rounded-lg bg-muted/40 border border-border">
        {(["CLT", "PJ"] as const).map(t => (
          <button type="button" key={t} onClick={() => setContractType(t)}
            className={`flex-1 py-2 rounded-md text-[13px] font-semibold transition-all ${contractType === t ? "gradient-brand text-white" : "bg-background border border-border text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <Section title="Dados da vaga" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data de admissão" required>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </Field>
          <Field label="Período de experiência">
            <Select value={String(probationPeriod)} onValueChange={v => setProbationPeriod(v ? Number(v) : null)}>
              <SelectTrigger><SelectValue placeholder="Sem período" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem período</SelectItem>
                {[15, 30, 45, 60].map(n => <SelectItem key={n} value={String(n)}>{n} dias</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Jornada de trabalho">
            <Input value={workSchedule} onChange={e => setWorkSchedule(e.target.value)} placeholder="Ex: 8h às 17h, seg-sex" />
          </Field>
          <Field label="Horas mensais">
            <Input type="number" value={monthlyHours} onChange={e => setMonthlyHours(Number(e.target.value))} />
          </Field>
          <Field label="Gestor responsável">
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {allUsers.filter(u => u.role === "leader" || u.role === "admin").map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Matrícula">
            <Input value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Opcional" />
          </Field>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Switch checked={firstJob} onCheckedChange={setFirstJob} />
          <Label className="text-[12px]">Primeiro emprego</Label>
        </div>
      </Section>

      <Section title="Dados pessoais">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome completo" required>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
          </Field>
          <Field label="Nome social / como prefere ser chamado">
            <Input value={socialName} onChange={e => setSocialName(e.target.value)} />
          </Field>
          <Field label="Data de nascimento">
            <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
          </Field>
          <Field label="Gênero">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {["Feminino","Masculino","Não-binário","Prefiro não informar"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cor/Raça">
            <Select value={race} onValueChange={setRace}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {["Branca","Preta","Parda","Amarela","Indígena","Prefiro não informar"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Estado civil">
            <Select value={civilStatus} onValueChange={setCivilStatus}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {["Solteiro(a)","Casado(a)","União estável","Divorciado(a)","Viúvo(a)"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nome da mãe">
            <Input value={motherName} onChange={e => setMotherName(e.target.value)} />
          </Field>
          <Field label="Nome do pai">
            <Input value={fatherName} onChange={e => setFatherName(e.target.value)} />
          </Field>
          <Field label="Tamanho de camiseta">
            <Select value={shirtSize} onValueChange={setShirtSize}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {["PP","P","M","G","GG","XGG"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Restrição alimentar">
            <Input value={foodRestrictions} onChange={e => setFoodRestrictions(e.target.value)} placeholder="Ex: vegetariano, sem glúten" />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={celebratesEvents} onCheckedChange={setCelebratesEvents} />
          <Label className="text-[12px]">Comemora aniversário / datas especiais</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={disability} onCheckedChange={setDisability} />
          <Label className="text-[12px]">Possui deficiência (PCD)</Label>
        </div>
        {disability && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de deficiência">
              <Input value={disabilityType} onChange={e => setDisabilityType(e.target.value)} />
            </Field>
            <Field label="Observações">
              <Input value={disabilityNotes} onChange={e => setDisabilityNotes(e.target.value)} />
            </Field>
          </div>
        )}
      </Section>

      <Section title="Formação acadêmica">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Escolaridade">
            <Select value={education} onValueChange={setEducation}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {["Ensino médio","Técnico","Graduação","Pós-graduação","Mestrado","Doutorado"].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ano de conclusão">
            <Input value={graduationYear} onChange={e => setGraduationYear(e.target.value)} placeholder="Ex: 2022" />
          </Field>
          <Field label="Instituição">
            <Input value={institution} onChange={e => setInstitution(e.target.value)} />
          </Field>
          <Field label="Curso">
            <Input value={course} onChange={e => setCourse(e.target.value)} />
          </Field>
        </div>
        <p className="text-[11px] text-muted-foreground">
          📎 Upload de diplomas e certificados disponível após integração com backend de arquivos
        </p>
      </Section>

      <Section title="Endereço e contatos">
        <div className="grid grid-cols-2 gap-3">
          <Field label="CEP">
            <Input value={cep} onChange={e => setCep(e.target.value)} placeholder="00000-000" />
          </Field>
          <Field label="País">
            <Input value={country} onChange={e => setCountry(e.target.value)} />
          </Field>
          <Field label="Endereço" required>
            <Input value={address} onChange={e => setAddress(e.target.value)} className="col-span-2" />
          </Field>
          <Field label="Número">
            <Input value={number} onChange={e => setNumber(e.target.value)} />
          </Field>
          <Field label="Complemento">
            <Input value={complement} onChange={e => setComplement(e.target.value)} />
          </Field>
          <Field label="Bairro">
            <Input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
          </Field>
          <Field label="Cidade">
            <Input value={city} onChange={e => setCity(e.target.value)} />
          </Field>
          <Field label="UF">
            <Input value={state} onChange={e => setState(e.target.value)} maxLength={2} placeholder="SP" />
          </Field>
          <Field label="Celular" required>
            <Input value={mobile} onChange={e => setMobile(e.target.value)} type="tel" />
          </Field>
          <Field label="Telefone">
            <Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
          </Field>
          <Field label="E-mail pessoal" required>
            <Input value={personalEmail} onChange={e => setPersonalEmail(e.target.value)} type="email" />
          </Field>
          <Field label="E-mail corporativo">
            <Input value={corporateEmail} onChange={e => setCorporateEmail(e.target.value)} type="email" />
          </Field>
        </div>

        {/* Contatos de emergência */}
        <div className="pt-2">
          <p className="text-[12px] font-semibold text-muted-foreground mb-2">Contatos de emergência</p>
          {emergencyContacts.map((ec, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2 p-2.5 rounded-md bg-muted/30 border border-border">
              <Input placeholder="Nome" value={ec.name} onChange={e => {
                const n = [...emergencyContacts]; n[i].name = e.target.value; setEmergencyContacts(n);
              }} className="text-[12px]" />
              <Input placeholder="Relação" value={ec.relationship} onChange={e => {
                const n = [...emergencyContacts]; n[i].relationship = e.target.value; setEmergencyContacts(n);
              }} className="text-[12px]" />
              <Input placeholder="Telefone" value={ec.phone} onChange={e => {
                const n = [...emergencyContacts]; n[i].phone = e.target.value; setEmergencyContacts(n);
              }} className="text-[12px]" />
              <Input placeholder="E-mail" value={ec.email} onChange={e => {
                const n = [...emergencyContacts]; n[i].email = e.target.value; setEmergencyContacts(n);
              }} className="text-[12px]" />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="text-[11px]"
            onClick={() => setEmergencyContacts([...emergencyContacts, { name:"",relationship:"",phone:"",email:"" }])}>
            + Adicionar contato
          </Button>
        </div>
      </Section>

      <Section title="Dependentes">
        {dependents.map((dep, i) => (
          <div key={i} className="p-3 rounded-md border border-border bg-muted/20 space-y-2 mb-2">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Nome" value={dep.name} onChange={e => { const n=[...dependents]; n[i].name=e.target.value; setDependents(n); }} className="text-[12px]" />
              <Input placeholder="Relação" value={dep.relationship} onChange={e => { const n=[...dependents]; n[i].relationship=e.target.value; setDependents(n); }} className="text-[12px]" />
              <Input type="date" value={dep.birthDate} onChange={e => { const n=[...dependents]; n[i].birthDate=e.target.value; setDependents(n); }} className="text-[12px]" />
              <Input placeholder="CPF" value={dep.cpf} onChange={e => { const n=[...dependents]; n[i].cpf=e.target.value; setDependents(n); }} className="text-[12px]" />
            </div>
            <button type="button" className="text-[11px] text-destructive hover:underline" onClick={() => setDependents(dependents.filter((_,j)=>j!==i))}>Remover</button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="text-[11px]"
          onClick={() => setDependents([...dependents, { name:"",relationship:"",birthDate:"",gender:"",education:"",cpf:"",hasDisability:false,irDependent:false }])}>
          + Adicionar dependente
        </Button>
      </Section>

      <Section title="Dados bancários">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Banco">
            <Input value={bank} onChange={e => setBank(e.target.value)} placeholder="Ex: Nubank, Itaú" />
          </Field>
          <Field label="Agência">
            <Input value={agency} onChange={e => setAgency(e.target.value)} />
          </Field>
          <Field label="Conta">
            <Input value={account} onChange={e => setAccount(e.target.value)} />
          </Field>
        </div>
        <p className="text-[11px] text-muted-foreground">
          💳 Integração com banco para envio automático disponível após conexão com backend
        </p>
      </Section>

      {/* Campos PJ condicionais */}
      {contractType === "PJ" && (
        <Section title="Dados PJ">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome da empresa" required>
              <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </Field>
            <Field label="CNPJ" required>
              <Input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
            </Field>
            <Field label="Endereço da empresa">
              <Input value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
            </Field>
            <Field label="Porte da empresa">
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {["MEI","ME","EPP","Médio","Grande"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="CNAE">
              <Input value={cnae} onChange={e => setCnae(e.target.value)} placeholder="Código da atividade econômica" />
            </Field>
            <Field label="Natureza jurídica">
              <Input value={legalNature} onChange={e => setLegalNature(e.target.value)} />
            </Field>
          </div>
        </Section>
      )}

      <div className="rounded-lg bg-muted/40 border border-border p-3 text-[11px] text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">📎 Documentos — upload via backend</p>
        <p>CPF · RG · CNH · Reservista · Título de eleitor · CTPS</p>
        {contractType === "PJ" && <p>+ Cartão CNPJ · Contrato social</p>}
        <p className="text-[10px]">Conecte um serviço de armazenamento (S3, Supabase Storage, Cloudinary) para habilitar uploads.</p>
      </div>

      <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={!fullName || !startDate}>
        {existing ? "Salvar alterações" : "Iniciar processo de admissão"}
      </Button>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function AdmissaoPage() {
  const { isAdmin, isLeader } = useAuth();
  const [records, setRecords] = useState<AdmissionRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdmissionRecord | null>(null);
  const [tab, setTab] = useState("ativos");

  useEffect(() => { refresh(); }, []);
  const refresh = () => setRecords(admissionApi.getAll());

  const handleAdvance = (id: string, current: AdmissionRecord["status"]) => {
    const idx = statusOrder.indexOf(current);
    if (idx < statusOrder.length - 1) {
      admissionApi.update(id, { status: statusOrder[idx + 1] });
      refresh();
      toast.success(`Status atualizado: ${statusConfig[statusOrder[idx + 1]].label}`);
    }
  };

  const ativos = records.filter(r => r.status !== "concluido");
  const concluidos = records.filter(r => r.status === "concluido");

  return (
    <>
      <PageHeader title="Admissão" subtitle="Processo de admissão CLT e PJ — todos os dados em um só lugar">
        <Dialog open={open || !!editing} onOpenChange={v => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-brand text-white border-0 text-[13px] gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Nova admissão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar admissão" : "Novo processo de admissão"}</DialogTitle>
            </DialogHeader>
            <AdmissaoForm existing={editing ?? undefined} onSave={() => {
              setOpen(false); setEditing(null); refresh();
              toast.success(editing ? "Admissão atualizada!" : "Admissão iniciada!");
            }} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Em andamento", value: ativos.length, color: "border-l-fluency-orange" },
          { label: "Aguardando colaborador", value: records.filter(r => r.status === "aguardando_preenchimento").length, color: "border-l-fluency-blue" },
          { label: "Conferência RH", value: records.filter(r => r.status === "conferencia_rh").length, color: "border-l-primary" },
          { label: "Concluídos", value: concluidos.length, color: "border-l-fluency-green" },
        ].map(s => (
          <div key={s.label} className={`relative overflow-hidden rounded-lg border border-border bg-card p-4 border-l-[3px] ${s.color}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="text-[26px] font-bold text-foreground leading-none mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Fluxo visual */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Fluxo do processo</p>
        <div className="flex items-center gap-0">
          {statusOrder.map((s, i) => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] ${cfg.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1.5 text-center leading-tight max-w-[70px]">{cfg.label}</p>
                </div>
                {i < statusOrder.length - 1 && <div className="h-[1px] w-6 bg-border shrink-0 -mt-5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 bg-muted/50 p-0.5">
          <TabsTrigger value="ativos" className="text-[13px]">
            Em andamento {ativos.length > 0 && <Badge variant="secondary" className="ml-1 text-[9px]">{ativos.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="concluidos" className="text-[13px]">
            Concluídos {concluidos.length > 0 && <Badge variant="secondary" className="ml-1 text-[9px]">{concluidos.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {[
          { key: "ativos", data: ativos },
          { key: "concluidos", data: concluidos },
        ].map(({ key, data }) => (
          <TabsContent key={key} value={key}>
            {data.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <UserPlus className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-[13px] text-muted-foreground">Nenhuma admissão {key === "ativos" ? "em andamento" : "concluída"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(r => {
                  const cfg = statusConfig[r.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5"
                            style={{ background: "linear-gradient(135deg, hsl(256 74% 59%), hsl(300 88% 71%))" }}>
                            {r.fullName ? r.fullName.split(" ").map(n => n[0]).slice(0,2).join("") : "?"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[13px] font-semibold text-foreground">{r.fullName || "Aguardando preenchimento"}</p>
                              <Badge variant="outline" className={`text-[9px] font-bold border-0 ${r.contractType === "CLT" ? "bg-fluency-blue/10 text-fluency-blue" : "bg-fluency-orange/10 text-fluency-orange"}`}>
                                {r.contractType}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {r.managerName && `Gestor: ${r.managerName} · `}
                              {r.startDate && `Início: ${new Date(r.startDate).toLocaleDateString("pt-BR")}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge variant="outline" className={`text-[10px] gap-1 border-0 ${cfg.color}`}>
                            <Icon className="h-3 w-3" />{cfg.label}
                          </Badge>
                          <div className="flex gap-1.5">
                            {r.status !== "concluido" && (
                              <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleAdvance(r.id, r.status)}>
                                Avançar →
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setEditing(r)}>
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
