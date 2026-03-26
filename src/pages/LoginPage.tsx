import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fluencyValues = [
  "Satisfação do Cliente em Primeiro Lugar",
  "Segurança é Inegociável",
  "Inovar com Simplicidade",
  "Se Apaixonar Pelo Problema",
  "Gerar Valor Para o Nosso Ecossistema",
  "Desafio é a Nossa Diversão",
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } else {
      toast.error("Email não encontrado. Use um email cadastrado na base.");
    }
  };

  const quickLogin = async (email: string) => {
    setLoading(true);
    await login(email, "demo");
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — Fluency deep purple brand */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "hsl(272 96% 19%)" }}
      >
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "hsl(256 74% 59%)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15"
          style={{ background: "hsl(300 88% 71%)" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-extrabold text-white"
            style={{ background: "hsl(256 74% 59%)" }}
          >
            F
          </div>
          <div>
            <p className="text-[15px] font-bold text-white tracking-wide leading-none">
              FLUENCY
            </p>
            <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">
              People Platform
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Sua jornada,<br />
            <span style={{ color: "hsl(252 100% 73%)" }}>no centro</span>
            <br />de tudo.
          </h2>
          <p className="text-[14px] text-white/60 leading-relaxed max-w-xs">
            Acompanhe seu desenvolvimento, registre seu sentimento e acesse tudo que importa para a sua carreira na Fluency.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">
            Valores Fluency
          </p>
          <div className="flex flex-wrap gap-2">
            {fluencyValues.map((v, i) => (
              <span
                key={i}
                className="rounded-md px-2.5 py-1 text-[10px] font-medium text-white/80"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-[380px] space-y-8 animate-fade-in">
          <div className="flex flex-col items-center lg:hidden">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold text-white mb-3"
              style={{ background: "hsl(256 74% 59%)" }}
            >
              F
            </div>
            <h1 className="text-xl font-bold text-foreground">Fluency People</h1>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Entre com seu email corporativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@fluencyacademy.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px]">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-brand text-white border-0 font-semibold"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Acesso rápido (demo)
            </p>
            <div className="space-y-1">
              <button
                onClick={() => quickLogin("paula@fluencyacademy.io")}
                className="w-full text-left rounded-md px-3 py-2 text-[13px] hover:bg-muted transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-medium text-foreground">Paula Letícia</span>
                  <span className="ml-2 text-[11px] text-muted-foreground">Admin · People Culture</span>
                </div>
                <span className="text-[10px] font-semibold text-fluency-orange bg-fluency-orange/10 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </button>
              <button
                onClick={() => quickLogin("fabio.dias@fluencyacademy.io")}
                className="w-full text-left rounded-md px-3 py-2 text-[13px] hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-foreground">Fabio Dias</span>
                  <span className="ml-2 text-[11px] text-muted-foreground">Líder · Coord. B2C</span>
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  Líder
                </span>
              </button>
              <button
                onClick={() => quickLogin("guilherme.poersch@fluencyacademy.io")}
                className="w-full text-left rounded-md px-3 py-2 text-[13px] hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-foreground">Guilherme Poersch</span>
                  <span className="ml-2 text-[11px] text-muted-foreground">Colaborador · Redação</span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Colab.
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
