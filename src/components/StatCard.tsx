import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "purple" | "pink" | "blue" | "green" | "orange";
}

const accentColor = {
  default:  "bg-muted-foreground/30",
  purple:   "bg-primary",
  pink:     "bg-fluency-pink",
  blue:     "bg-fluency-blue",
  green:    "bg-fluency-green",
  orange:   "bg-fluency-orange",
};

const iconBg = {
  default: "bg-muted",
  purple:  "bg-primary/10",
  pink:    "bg-fluency-pink/10",
  blue:    "bg-fluency-blue/10",
  green:   "bg-fluency-green/10",
  orange:  "bg-fluency-orange/10",
};

const iconColor = {
  default: "text-muted-foreground",
  purple:  "text-primary",
  pink:    "text-fluency-pink",
  blue:    "text-fluency-blue",
  green:   "text-fluency-green",
  orange:  "text-fluency-orange",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 flex items-start gap-3">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg ${accentColor[variant]}`} />
      <div className="flex-1 min-w-0 pl-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 text-[26px] font-bold tracking-tight text-foreground leading-none">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-[12px] text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p
            className={`mt-0.5 text-[12px] font-medium ${
              trend.positive ? "text-success" : "text-destructive"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${iconBg[variant]}`}
      >
        <Icon className={`h-[18px] w-[18px] ${iconColor[variant]}`} />
      </div>
    </div>
  );
}
