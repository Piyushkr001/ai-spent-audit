"use client";

import { ArrowDown, ArrowRight, CheckCircle, Info, Warning, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { ToolRecommendation, SeverityLevel } from "@/lib/audit/types";
import { type CurrencyConfig, formatCurrency } from "@/lib/audit/currency";

interface Props {
  rec: ToolRecommendation;
  currency: CurrencyConfig;
}

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  {
    icon: React.ElementType;
    badgeLabel: string;
    badgeClass: string;
    cardBorder: string;
    iconClass: string;
    bgClass: string;
  }
> = {
  critical: {
    icon: XCircle,
    badgeLabel: "Critical",
    badgeClass:
      "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-800/50",
    cardBorder: "border-red-500/30 hover:border-red-500/50",
    iconClass: "text-red-500",
    bgClass: "bg-red-50 dark:bg-red-950/20",
  },
  warning: {
    icon: Warning,
    badgeLabel: "Warning",
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
    cardBorder: "border-amber-500/30 hover:border-amber-500/50",
    iconClass: "text-amber-500",
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
  },
  info: {
    icon: Info,
    badgeLabel: "Opportunity",
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
    cardBorder: "border-blue-500/30 hover:border-blue-500/50",
    iconClass: "text-blue-500",
    bgClass: "bg-blue-50 dark:bg-blue-950/20",
  },
  good: {
    icon: CheckCircle,
    badgeLabel: "Optimised",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    cardBorder: "border-emerald-500/20 hover:border-emerald-500/40",
    iconClass: "text-emerald-500",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
  },
};

export function RecommendationCard({ rec, currency }: Props) {
  const config = SEVERITY_CONFIG[rec.severity];
  const Icon = config.icon;
  const hasSavings = rec.monthlySavings > 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md",
        config.cardBorder
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              config.bgClass
            )}
          >
            <Icon size={18} weight="fill" className={config.iconClass} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {rec.toolName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(rec.currentSpend, currency)}/mo current spend
            </p>
          </div>
        </div>

        {/* Severity badge */}
        <span
          className={cn(
            "shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            config.badgeClass
          )}
        >
          {config.badgeLabel}
        </span>
      </div>

      {/* Savings pill */}
      {hasSavings && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2">
          <ArrowDown
            size={14}
            className="text-emerald-600 dark:text-emerald-400 shrink-0"
          />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Save {formatCurrency(rec.monthlySavings, currency)}/mo
          </span>
          <span className="text-xs text-muted-foreground">
            → {formatCurrency(rec.suggestedSpend, currency)}/mo target
          </span>
        </div>
      )}

      {/* Insight */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {rec.insight}
      </p>

      {/* Action */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
        <ArrowRight
          size={12}
          weight="bold"
          className="mt-0.5 shrink-0 text-muted-foreground"
        />
        <p className="text-xs font-medium text-foreground">{rec.action}</p>
      </div>
    </div>
  );
}
