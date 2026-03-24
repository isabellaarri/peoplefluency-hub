import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  // Quick login helpers for demo
  const quickLogin = async (email: string) => {
    setLoading(true);
    await login(email, "demo");
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-brand">
            <span className="text-xl font-extrabold text-white">F</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Fluency People</h1>
          <p className="text-sm text-muted-foreground mt-1">Plataforma de Gestão de Pessoas</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Demo quick access */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acesso rápido (demo)</p>
          <div className="space-y-1.5">
            <button onClick={() => quickLogin("paula@fluencyacademy.io")} className="w-full text-left rounded-md px-3 py-2 text-[13px] hover:bg-muted/80 transition-colors">
              <span className="font-medium text-foreground">Paula Letícia</span>
              <span className="ml-2 text-xs text-muted-foreground">Admin · People Culture</span>
            </button>
            <button onClick={() => quickLogin("fabio.dias@fluencyacademy.io")} className="w-full text-left rounded-md px-3 py-2 text-[13px] hover:bg-muted/80 transition-colors">
              <span className="font-medium text-foreground">Fabio Dias</span>
              <span className="ml-2 text-xs text-muted-foreground">Líder · Coordenador B2C</span>
            </button>
            <button onClick={() => quickLogin("guilherme.poersch@fluencyacademy.io")} className="w-full text-left rounded-md px-3 py-2 text-[13px] hover:bg-muted/80 transition-colors">
              <span className="font-medium text-foreground">Guilherme Poersch</span>
              <span className="ml-2 text-xs text-muted-foreground">Colaborador · Redação</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
