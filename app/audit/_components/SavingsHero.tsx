"use client";

import { TrendUp, CheckCircle, Warning, ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { AuditResult } from "@/lib/audit/types";
import {
  type CurrencyConfig,
  formatCurrency,
  formatCurrencyCompact,
} from "@/lib/audit/currency";

interface Props {
  result: AuditResult;
  currency: CurrencyConfig;
}

export function SavingsHero({ result, currency }: Props) {
  const {
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    efficiencyScore,
    isSpendingWell,
  } = result;

  const hasSavings = totalMonthlySavings > 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 sm:p-8",
        hasSavings
          ? "bg-linear-to-br from-blue-600 to-cyan-500 text-white"
          : "bg-linear-to-br from-emerald-500 to-teal-500 text-white"
      )}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      {/* Icon */}
      <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
        {isSpendingWell ? (
          <CheckCircle size={24} weight="fill" />
        ) : (
          <TrendUp size={24} weight="fill" />
        )}
      </div>

      {/* Headline */}
      {isSpendingWell ? (
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Verdict
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            You&apos;re spending well 🎉
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            Your AI stack is lean and optimised. Savings opportunity is under{" "}
            {formatCurrency(100, currency)}/mo — nothing major to act on right now.
          </p>
        </div>
      ) : (
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Potential savings found
          </p>
          <h2 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {formatCurrencyCompact(totalAnnualSavings, currency)}
            <span className="text-2xl font-semibold">/yr</span>
          </h2>
          <p className="mt-0.5 text-lg font-medium text-white/80">
            {formatCurrencyCompact(totalMonthlySavings, currency)}/month in recoverable spend
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="relative mt-6 grid grid-cols-3 gap-3">
        <StatPill
          label="Monthly Spend"
          value={formatCurrencyCompact(totalMonthlySpend, currency)}
          subtext="/mo"
        />
        <StatPill
          label="Monthly Savings"
          value={formatCurrencyCompact(totalMonthlySavings, currency)}
          subtext="/mo"
          highlight
        />
        <StatPill
          label="Efficiency Score"
          value={`${efficiencyScore}`}
          subtext="/100"
          score={efficiencyScore}
        />
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  subtext,
  highlight,
  score,
}: {
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
  score?: number;
}) {
  const scoreColor =
    score !== undefined
      ? score >= 80
        ? "text-emerald-200"
        : score >= 60
        ? "text-yellow-200"
        : "text-red-200"
      : "";

  return (
    <div className="rounded-xl bg-white/15 px-3 py-3 backdrop-blur-sm text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 truncate">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-base font-bold leading-tight break-all",
          highlight && "text-yellow-200",
          scoreColor
        )}
      >
        {value}
        <span className="text-xs font-normal text-white/60">{subtext}</span>
      </p>
    </div>
  );
}

// ─── Credex CTA ───────────────────────────────────────────────────────────────
export function CredexCTA({
  monthlySavings,
  currency,
}: {
  monthlySavings: number;
  currency: CurrencyConfig;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-linear-to-br from-blue-950/60 to-cyan-950/40 p-6 dark:from-blue-950/80 dark:to-cyan-950/60">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
            <Warning size={22} weight="fill" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              High-value opportunity detected
            </p>
            <h3 className="mt-0.5 text-base font-bold text-foreground">
              {formatCurrencyCompact(monthlySavings, currency)}/mo is slipping through the cracks
            </h3>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              At this scale, a 30-minute Credex consultation typically pays for itself within the first week. We&apos;ll map your AI stack, identify contract renegotiation levers, and build you an action plan.
            </p>
          </div>
        </div>

        <a
          href="https://credex.ai/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98] sm:min-w-[160px]"
        >
          Book Free Call
          <ArrowRight size={14} weight="bold" />
        </a>
      </div>
    </div>
  );
}
