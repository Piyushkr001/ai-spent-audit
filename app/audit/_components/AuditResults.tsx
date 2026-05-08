"use client";

import { SavingsHero, CredexCTA } from "./SavingsHero";
import { RecommendationCard } from "./RecommendationCard";
import type { AuditResult } from "@/lib/audit/types";
import type { CurrencyConfig } from "@/lib/audit/currency";

interface Props {
  result: AuditResult;
  currency: CurrencyConfig;
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2, good: 3 };

export function AuditResults({ result, currency }: Props) {
  const sorted = [...result.recommendations].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return (
    <section
      id="audit-results"
      aria-label="Audit results"
      className="flex flex-col gap-8"
    >
      {/* Hero savings banner */}
      <SavingsHero result={result} currency={currency} />

      {/* Credex CTA (only when savings > $500/mo) */}
      {result.showCredexCTA && (
        <CredexCTA monthlySavings={result.totalMonthlySavings} currency={currency} />
      )}

      {/* Per-tool recommendations */}
      {sorted.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Per-Tool Breakdown
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sorted.map((rec) => (
              <RecommendationCard key={rec.toolId} rec={rec} currency={currency} />
            ))}
          </div>
        </div>
      )}

      {/* Summary message */}
      <p className="text-center text-xs text-muted-foreground">
        {result.summaryMessage}
      </p>
    </section>
  );
}
