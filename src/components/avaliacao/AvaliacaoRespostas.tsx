import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, Eye } from "lucide-react";
import { sampleResponses } from "@/data/evaluationData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { defaultScale } from "@/data/evaluationConfig";

const typeLabels: Record<string, string> = {
  autoavaliacao: "Auto",
  lider_liderado: "Líder→Lid",
  liderado_lider: "Lid→Líder",
  par: "Par",
};

const typeColors: Record<string, string> = {
  autoavaliacao: "bg-muted text-muted-foreground",
  lider_liderado: "bg-primary/10 text-primary",
  liderado_lider: "bg-fluency-pink/10 text-fluency-pink",
  par: "bg-fluency-blue/10 text-fluency-blue",
};

const scoreColor = (s: number) =>
  s >= 4 ? "text-success font-semibold" : s >= 3 ? "text-warning font-semibold" : s > 0 ? "text-destructive font-semibold" : "text-muted-foreground";

export function AvaliacaoRespostas() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = sampleResponses.filter((r) => {
    const matchSearch = r.evaluatedName.toLowerCase().includes(search.toLowerCase()) || r.evaluatorName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar avaliador ou avaliado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[13px]"
          />
        </div>
        <div className="flex gap-1">
          {["all", "autoavaliacao", "lider_liderado", "liderado_lider", "par"].map((t) => (
            <Button
              key={t}
              variant={filterType === t ? "default" : "outline"}
              size="sm"
              className="h-7 text-[11px] px-2"
              onClick={() => setFilterType(t)}
            >
              {t === "all" ? "Todos" : typeLabels[t]}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Avaliador</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Avaliado</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Tipo</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Modelo</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Estrat.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Exec.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Inov.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Conex.</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-foreground">{r.evaluatorName}</p>
                  </td>
                  <td className="px-3 py-2.5 text-foreground">{r.evaluatedName}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColors[r.type]}`}>
                      {typeLabels[r.type]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Badge variant="secondary" className="text-[11px] font-normal">{r.model}°</Badge>
                  </td>
                  <td className={`px-3 py-2.5 text-center ${scoreColor(r.scores.focoEstrategico)}`}>{r.scores.focoEstrategico}</td>
                  <td className={`px-3 py-2.5 text-center ${scoreColor(r.scores.execucaoAgil)}`}>{r.scores.execucaoAgil}</td>
                  <td className={`px-3 py-2.5 text-center ${scoreColor(r.scores.inovacao)}`}>{r.scores.inovacao}</td>
                  <td className={`px-3 py-2.5 text-center ${scoreColor(r.scores.conexaoDesenvolvimento)}`}>{r.scores.conexaoDesenvolvimento}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium bg-success/10 text-success">{r.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-[15px]">
                            {r.evaluatorName} → {r.evaluatedName}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-[13px]">
                          <div className="flex gap-2">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColors[r.type]}`}>{typeLabels[r.type]}</span>
                            <Badge variant="secondary" className="text-[11px]">{r.model}°</Badge>
                          </div>

                          <div>
                            <p className="font-medium text-foreground mb-2">Competências</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: "Foco Estratégico", score: r.scores.focoEstrategico },
                                { label: "Execução Ágil", score: r.scores.execucaoAgil },
                                { label: "Inovação", score: r.scores.inovacao },
                                { label: "Conexão", score: r.scores.conexaoDesenvolvimento },
                              ].map((s) => (
                                <div key={s.label} className="flex items-center justify-between p-2 rounded bg-muted/30">
                                  <span className="text-muted-foreground">{s.label}</span>
                                  <span className={scoreColor(s.score)}>{s.score}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {(r.scores.liderancaProxima || r.scores.liderancaInspiradora) && (
                            <div>
                              <p className="font-medium text-foreground mb-2">Liderança</p>
                              <div className="grid grid-cols-2 gap-2">
                                {r.scores.liderancaProxima && (
                                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                                    <span className="text-muted-foreground">Próxima</span>
                                    <span className={scoreColor(r.scores.liderancaProxima)}>{r.scores.liderancaProxima}</span>
                                  </div>
                                )}
                                {r.scores.liderancaInspiradora && (
                                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                                    <span className="text-muted-foreground">Inspiradora</span>
                                    <span className={scoreColor(r.scores.liderancaInspiradora)}>{r.scores.liderancaInspiradora}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-foreground mb-2">Loop de Valor</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: "Comunidade", score: r.scores.fomentoComunidade },
                                { label: "Demanda", score: r.scores.geracaoDemanda },
                                { label: "Conversão IA", score: r.scores.conversaoIaHumano },
                                { label: "Entrega", score: r.scores.entregaEncantadora },
                                { label: "Operação", score: r.scores.operacaoEficiente },
                              ].map((s) => (
                                <div key={s.label} className="flex items-center justify-between p-2 rounded bg-muted/30">
                                  <span className="text-muted-foreground">{s.label}</span>
                                  <span className={scoreColor(s.score)}>{s.score}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {r.mandaBem && (
                            <div>
                              <p className="font-medium text-foreground mb-1">✅ Manda bem em…</p>
                              <p className="text-muted-foreground bg-muted/30 p-2 rounded">{r.mandaBem}</p>
                            </div>
                          )}
                          {r.podeMelhorar && (
                            <div>
                              <p className="font-medium text-foreground mb-1">🔄 Pode melhorar…</p>
                              <p className="text-muted-foreground bg-muted/30 p-2 rounded">{r.podeMelhorar}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
