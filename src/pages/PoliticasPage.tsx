import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, FileText, Heart, Shield, Users, Briefcase, GraduationCap } from "lucide-react";

const policies = [
  {
    category: "Benefícios",
    icon: Heart,
    items: [
      { title: "Plano de Saúde", desc: "Cobertura médica e odontológica para todos os colaboradores CLT", status: "ativo" },
      { title: "Vale Alimentação / Refeição", desc: "Cartão flexível via Caju com valor mensal", status: "ativo" },
      { title: "Gympass / Wellhub", desc: "Acesso a academias e apps de bem-estar", status: "ativo" },
      { title: "Day Off de Aniversário", desc: "Folga no dia do seu aniversário — aproveite!", status: "ativo" },
    ],
  },
  {
    category: "Cultura & Desenvolvimento",
    icon: GraduationCap,
    items: [
      { title: "Fluency Academy Gratuita", desc: "Acesso completo a todos os cursos da plataforma", status: "ativo" },
      { title: "Programa de Mentoria", desc: "Mentorias internas entre líderes e colaboradores", status: "ativo" },
      { title: "PDI — Plano de Desenvolvimento", desc: "Modelo 70-20-10 com acompanhamento trimestral", status: "ativo" },
      { title: "Avaliação de Desempenho", desc: "Ciclos semestrais com feedback 360°", status: "ativo" },
    ],
  },
  {
    category: "Trabalho & Jornada",
    icon: Briefcase,
    items: [
      { title: "Modelo Híbrido / Remoto", desc: "Flexibilidade de trabalho conforme acordo com gestor", status: "ativo" },
      { title: "Férias e Recesso", desc: "30 dias de férias CLT + recesso coletivo de fim de ano", status: "ativo" },
      { title: "Horário Flexível", desc: "Jornada flexível com core hours das 10h às 16h", status: "ativo" },
      { title: "Licença Maternidade/Paternidade", desc: "6 meses para mães e 20 dias para pais", status: "ativo" },
    ],
  },
  {
    category: "Segurança & Compliance",
    icon: Shield,
    items: [
      { title: "Código de Conduta", desc: "Diretrizes de comportamento e ética profissional", status: "ativo" },
      { title: "LGPD e Privacidade", desc: "Política de proteção de dados pessoais", status: "ativo" },
      { title: "Canal de Denúncias", desc: "Canal seguro e anônimo para relatos", status: "ativo" },
    ],
  },
];

export default function PoliticasPage() {
  return (
    <>
      <PageHeader title="Políticas de People" subtitle="Benefícios, regras e diretrizes da Fluency" />

      <div className="space-y-6">
        {policies.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-2 mb-3">
              <cat.icon className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">{cat.category}</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {cat.items.map((item, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 hover:border-primary/20 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] text-success border-success/30 shrink-0">Ativo</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-5 text-center">
        <BookOpen className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-[13px] text-muted-foreground">Dúvidas sobre políticas? Fale com o time de <strong className="text-foreground">People & Culture</strong></p>
        <p className="text-[11px] text-muted-foreground mt-1">people@fluencyacademy.io</p>
      </div>
    </>
  );
}
