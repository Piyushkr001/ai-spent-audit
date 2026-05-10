"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { MagnifyingGlass, Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolSpendRow, AddRowButton } from "./ToolSpendRow";
import { AuditResults } from "./AuditResults";
import { runAudit } from "@/lib/audit/engine";
import type { AuditFormState, AuditResult, ToolRow, UseCase } from "@/lib/audit/types";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  detectCurrencyFromLocale,
  getCurrencyByCode,
  toUsd,
  type CurrencyConfig,
} from "@/lib/audit/currency";

// ─── Local-storage key ────────────────────────────────────────────────────────
const LS_KEY = "spendlens-audit-form-v2";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function makeEmptyRow(): ToolRow {
  return { id: uid(), toolId: "", plan: "", monthlySpend: 0, seats: 1 };
}

const DEFAULT_FORM: AuditFormState = {
  teamSize: 1,
  useCase: "",
  tools: [makeEmptyRow()],
  currencyCode: "USD",
};

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding",   label: "Software Engineering" },
  { value: "writing",  label: "Content & Copywriting" },
  { value: "data",     label: "Data & Analytics" },
  { value: "research", label: "Research & Academia" },
  { value: "mixed",    label: "Mixed / General" },
];



// ─── Component ────────────────────────────────────────────────────────────────
export function SpendAuditForm() {
  const [form, setForm] = useState<AuditFormState>(DEFAULT_FORM);
  const [normalizedForm, setNormalizedForm] = useState<AuditFormState | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<CurrencyConfig>(DEFAULT_CURRENCY);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Auto-detect currency or load from localStorage ──────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    let initialForm = DEFAULT_FORM;
    let initialCurrency = DEFAULT_CURRENCY;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        initialForm = { ...DEFAULT_FORM };
        if (parsed.currencyCode) {
           initialCurrency = getCurrencyByCode(parsed.currencyCode);
           initialForm.currencyCode = parsed.currencyCode;
        } else {
           initialCurrency = detectCurrencyFromLocale();
           initialForm.currencyCode = initialCurrency.code;
        }
      } catch { }
    } else {
      initialCurrency = detectCurrencyFromLocale();
      initialForm.currencyCode = initialCurrency.code;
    }

    setTimeout(() => {
      setActiveCurrency(initialCurrency);
      setForm(initialForm);
      setHasHydrated(true);
    }, 0);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(LS_KEY, JSON.stringify(form));
    }
  }, [form, hasHydrated]);

  // ─── Form mutators ──────────────────────────────────────────────────────────
  const setTeamSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      setForm((f) => ({ ...f, teamSize: isNaN(val) || val < 1 ? 1 : val }));
    },
    []
  );

  const setUseCase = useCallback((val: string | null) => {
    if (!val) return;
    setForm((f) => ({ ...f, useCase: val as UseCase }));
  }, []);

  const handleCurrencyChange = useCallback((code: string | null) => {
    if (!code) return;
    const currency = getCurrencyByCode(code);
    setActiveCurrency(currency);
    setForm((f) => ({ ...f, currencyCode: code }));
  }, []);

  const updateRow = useCallback((id: string, updated: ToolRow) => {
    setForm((f) => ({
      ...f,
      tools: f.tools.map((t) => (t.id === id ? updated : t)),
    }));
  }, []);

  const addRow = useCallback(() => {
    setForm((f) => ({ ...f, tools: [...f.tools, makeEmptyRow()] }));
  }, []);

  const removeRow = useCallback((id: string) => {
    setForm((f) => ({
      ...f,
      tools: f.tools.length > 1 ? f.tools.filter((t) => t.id !== id) : f.tools,
    }));
  }, []);

  // ─── Submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = {
      ...form,
      currencyCode: "USD",
      tools: form.tools.map((t) => ({
        ...t,
        monthlySpend: toUsd(t.monthlySpend, activeCurrency),
      })),
    };
    const auditResult = runAudit(normalized);
    setNormalizedForm(normalized);
    setResult(auditResult);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const hasValidTool = form.tools.some(
    (t) => t.toolId !== "" && t.monthlySpend > 0
  );

  return (
    <div className="flex flex-col gap-12">
      {/* ─── Form card ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="AI spend audit form"
        className="rounded-2xl border border-border bg-card shadow-sm shadow-black/5"
      >
        {/* Card header */}
        <div className="border-b border-border px-6 py-5 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Your AI Stack
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Enter every AI subscription your team pays for. Precision = better recommendations.
            </p>
          </div>

          {/* ── Currency selector ───────────────────────────────────────── */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Globe size={11} />
              Currency
            </label>
            <Select value={activeCurrency.code} onValueChange={handleCurrencyChange}>
              <SelectTrigger
                id="currency-select"
                className="h-8 w-full text-xs gap-1.5"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="font-mono text-[11px] text-muted-foreground w-8 inline-block">
                      {c.code}
                    </span>
                    {" "}{c.symbol} · {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasHydrated && activeCurrency.code !== "USD" && (
              <p className="text-[10px] text-muted-foreground">
                Enter amounts in {activeCurrency.code} — we convert to USD internally
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          {/* ── Team meta ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="team-size"
                className="text-xs font-semibold text-foreground"
              >
                Team size
              </label>
              <Input
                id="team-size"
                type="number"
                min={1}
                max={100000}
                value={form.teamSize}
                onChange={setTeamSize}
                className="h-9"
                placeholder="e.g. 12"
              />
              <p className="text-[10px] text-muted-foreground">
                Total number of people using AI tools
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="use-case"
                className="text-xs font-semibold text-foreground"
              >
                Primary use case
              </label>
              <Select value={form.useCase} onValueChange={setUseCase}>
                <SelectTrigger id="use-case" className="h-9 w-full">
                  <SelectValue placeholder="Select use case…" />
                </SelectTrigger>
                <SelectContent>
                  {USE_CASES.map((uc) => (
                    <SelectItem key={uc.value} value={uc.value}>
                      {uc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Helps us tailor recommendations to your workflow
              </p>
            </div>
          </div>

          {/* ── Divider ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              AI Tools
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* ── Tool rows ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {form.tools.map((row, index) => (
              <ToolSpendRow
                key={row.id}
                row={row}
                index={index}
                canRemove={form.tools.length > 1}
                currency={activeCurrency}
                onChange={(updated) => updateRow(row.id, updated)}
                onRemove={() => removeRow(row.id)}
              />
            ))}

            <AddRowButton
              onClick={addRow}
              disabled={form.tools.length >= 20}
            />
          </div>
        </div>

        {/* Card footer */}
        <div className="rounded-b-2xl border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[10px] text-muted-foreground">
            The audit runs locally. Data is only stored if you choose to save or email the report.
          </p>
          <Button
            type="submit"
            disabled={!hasValidTool}
            className="h-9 gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 disabled:opacity-40 px-5 rounded-xl font-semibold shadow-md shadow-blue-500/20"
          >
            <MagnifyingGlass size={15} weight="bold" />
            Run Audit
          </Button>
        </div>
      </form>

      {/* ─── Results ───────────────────────────────────────────────────────── */}
      {result && (
        <div ref={resultsRef}>
          <AuditResults result={result} currency={activeCurrency} form={normalizedForm || form} />
        </div>
      )}
    </div>
  );
}
