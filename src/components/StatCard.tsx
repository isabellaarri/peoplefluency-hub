import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "purple" | "pink" | "blue" | "green" | "orange";
}

const variantStyles = {
  default: "bg-card border border-border",
  purple: "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20",
  pink: "bg-gradient-to-br from-fluency-pink/10 to-fluency-pink/5 border border-fluency-pink/20",
  blue: "bg-gradient-to-br from-fluency-blue/10 to-fluency-blue/5 border border-fluency-blue/20",
  green: "bg-gradient-to-br from-fluency-green/10 to-fluency-green/5 border border-fluency-green/20",
  orange: "bg-gradient-to-br from-fluency-orange/10 to-fluency-orange/5 border border-fluency-orange/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  purple: "gradient-brand text-primary-foreground",
  pink: "bg-fluency-pink/20 text-fluency-pink",
  blue: "bg-fluency-blue/20 text-fluency-blue",
  green: "bg-fluency-green/20 text-fluency-green",
  orange: "bg-fluency-orange/20 text-fluency-orange",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
