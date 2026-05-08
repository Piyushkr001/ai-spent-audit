import type { Metadata } from "next";
import { SpendAuditForm } from "./_components/SpendAuditForm";

export const metadata: Metadata = {
  title: "AI Spend Audit | SpendLens AI",
  description:
    "Analyse your team's AI tool subscriptions and uncover savings opportunities in minutes. Free, instant, no sign-up required.",
};

export default function AuditPage() {
  return (
    <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* ── Page heading ───────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          {/* Label pill */}
          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-cyan-400">
            Free · Instant · No sign-up
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Audit Your{" "}
            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI Spend
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-muted-foreground leading-relaxed">
            Enter every AI tool your team pays for. Our engine cross-checks your
            spend against current public pricing, detects overpayments, overlapping
            subscriptions, and under-utilised plans — then gives you a concrete
            action list.
          </p>

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              "100% client-side — nothing leaves your browser",
              "Deterministic rules, not AI hallucinations",
              "Results in under 2 seconds",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Form + Results ─────────────────────────────────────────────── */}
        <SpendAuditForm />
      </div>
    </main>
  );
}