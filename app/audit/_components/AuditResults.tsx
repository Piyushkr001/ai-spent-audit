"use client";

import { useState } from "react";
import { SavingsHero, CredexCTA } from "./SavingsHero";
import { RecommendationCard } from "./RecommendationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuditResult, AuditFormState } from "@/lib/audit/types";
import type { CurrencyConfig } from "@/lib/audit/currency";
import axios from "axios";
import { toast } from "sonner";
import { ShareNetwork, Copy } from "@phosphor-icons/react";

interface Props {
  result: AuditResult;
  currency: CurrencyConfig;
  hideSaveAction?: boolean;
  form?: AuditFormState; // Needed for API if saving
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2, good: 3 };

export function AuditResults({ result, currency, hideSaveAction, form }: Props) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [isSaving, setIsSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !email) return;
    
    setIsSaving(true);
    try {
      const response = await axios.post("/api/audits", {
        form,
        email,
        companyName,
        role,
        website,
      });
      const data = response.data;
      if (data.spam || !data.url) {
        toast.success("Report saved successfully!");
        return;
      }
      const fullUrl = `${window.location.origin}${data.url}`;
      setSavedUrl(fullUrl);
      toast.success("Report saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save report.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (savedUrl) {
      navigator.clipboard.writeText(savedUrl);
      toast.success("Link copied to clipboard!");
    }
  };

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

      {/* Save & Share Action */}
      {!hideSaveAction && (
        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Save & Share Report</h3>
          <p className="text-xs text-slate-500 mb-4">
            Get a permanent, shareable URL for this audit report.
          </p>
          
          {savedUrl ? (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 truncate">{savedUrl}</span>
              <Button size="icon" variant="ghost" onClick={copyToClipboard} aria-label="Copy link">
                <Copy size={16} />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Work Email (required)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Input
                  type="text"
                  placeholder="Company Name (optional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder="Role (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex-1"
                />
                {/* Honeypot field */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ display: 'none' }}
                  aria-hidden="true"
                />
              </div>
              <Button type="submit" disabled={isSaving || !email} className="gap-2 shrink-0 sm:self-end">
                <ShareNetwork size={16} />
                {isSaving ? "Saving..." : "Save Report"}
              </Button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
