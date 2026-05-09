/**
 * Deterministic, rule-based audit engine.
 * No AI calls — fully testable with pure functions.
 */
import type {
  AuditFormState,
  AuditResult,
  ToolId,
  ToolRecommendation,
  SeverityLevel,
} from "./types";
import {
  getToolMeta,
  getPlanMeta,
  expectedMonthlyCost,
} from "./pricing";

// ─── Overlap rules: tools that are redundant with each other ──────────────────
const OVERLAP_GROUPS: ToolId[][] = [
  ["cursor", "github-copilot", "windsurf"],          // IDE coding assistants
  ["claude", "chatgpt", "gemini"],                    // General chat
  ["anthropic-api", "openai-api"],                    // Direct API
];

// ─── Per-seat thresholds (monthly, USD) ───────────────────────────────────────
const OVERPAY_RATIO_THRESHOLD = 1.5; // paying >150 % of expected → overpaying

// ─── Main entry point ─────────────────────────────────────────────────────────
export function runAudit(form: AuditFormState): AuditResult {
  const validTools = form.tools.filter(
    (t) => t.toolId !== "" && t.monthlySpend > 0
  );

  const recommendations: ToolRecommendation[] = [];

  for (const row of validTools) {
    if (!row.toolId) continue;
    const toolId = row.toolId as ToolId;
    const toolMeta = getToolMeta(toolId);
    if (!toolMeta) continue;

    const planMeta = row.plan ? getPlanMeta(toolId, row.plan as never) : undefined;
    const expectedCost = row.plan
      ? expectedMonthlyCost(toolId, row.plan as never, row.seats)
      : null;

    let monthlySavings = 0;
    let severity: SeverityLevel = "good";
    let insight = "";
    let action = "";
    let suggestedSpend = row.monthlySpend;

    // ── Rule 1: Overpaying vs listed price ──────────────────────────────────
    if (expectedCost !== null && row.monthlySpend > expectedCost * OVERPAY_RATIO_THRESHOLD) {
      monthlySavings = Math.round(row.monthlySpend - expectedCost);
      suggestedSpend = expectedCost;
      severity = "critical";
      insight = `You are paying $${row.monthlySpend.toFixed(0)}/mo but the listed ${planMeta?.label ?? "plan"} price for ${row.seats} seat(s) is $${expectedCost.toFixed(0)}/mo.`;
      action = "Audit your invoice — you may have unused seats, duplicate subscriptions, or an outdated contract.";
    }

    // ── Rule 2: Enterprise plan for a small team ────────────────────────────
    else if (
      row.plan === "enterprise" &&
      row.seats < 5
    ) {
      const lowerPlan = toolMeta.plans.find(
        (p) => (p.id === "team" || p.id === "business" || p.id === "pro") && !p.isFreeOrAPI && p.pricePerSeat > 0
      ) || toolMeta.plans.find((p) => p.id !== "enterprise" && !p.isFreeOrAPI && p.pricePerSeat > 0);
      
      if (lowerPlan) {
        const lowerCost = lowerPlan.pricePerSeat * row.seats;
        if (lowerCost < row.monthlySpend) {
          monthlySavings = Math.round(row.monthlySpend - lowerCost);
          suggestedSpend = lowerCost;
          severity = "warning";
          insight = `Enterprise plan for only ${row.seats} seat(s) is overkill at $${row.monthlySpend.toFixed(0)}/mo. The "${lowerPlan.label}" plan would be $${lowerCost.toFixed(0)}/mo.`;
          action = `Downgrade to the "${lowerPlan.label}" plan until you hit enterprise-scale requirements.`;
        }
      }
    }

    // ── Rule 3: Team plan with fewer than 3 seats — individual plan cheaper ──
    else if (
      (row.plan === "team" || row.plan === "business") &&
      row.seats < 3
    ) {
      const indivPlan = toolMeta.plans.find(
        (p) => p.id !== "team" && p.id !== "business" && p.id !== "enterprise" && !p.isFreeOrAPI && p.pricePerSeat > 0
      );
      if (indivPlan) {
        const indivCost = indivPlan.pricePerSeat * row.seats;
        if (indivCost < row.monthlySpend) {
          monthlySavings = Math.round(row.monthlySpend - indivCost);
          suggestedSpend = indivCost;
          severity = "warning";
          insight = `${planMeta?.label || "Team"} plan with only ${row.seats} seat(s) costs $${row.monthlySpend.toFixed(0)}/mo. Individual "${indivPlan.label}" plan would be $${indivCost.toFixed(0)}/mo.`;
          action = `Downgrade to the "${indivPlan.label}" plan until your team grows beyond 3.`;
        }
      }
    }

    // ── Rule 4: Free-tier user paying for a pro plan with only 1 seat ───────
    else if (
      planMeta &&
      !planMeta.isFreeOrAPI &&
      row.seats === 1 &&
      row.monthlySpend > 0 &&
      toolMeta.plans.some((p) => p.isFreeOrAPI && p.pricePerSeat === 0)
    ) {
      const freePlan = toolMeta.plans.find(
        (p) => p.isFreeOrAPI && p.pricePerSeat === 0
      );
      if (freePlan) {
        monthlySavings = 0; // Can't auto-calculate — user may need paid features
        suggestedSpend = row.monthlySpend;
        severity = "info";
        insight = `${toolMeta.name} has a robust free tier ("${freePlan.label}"). Evaluate if your single seat actually needs the paid plan.`;
        action = `Try the free tier for a sprint and see if it meets your ${form.useCase || "use-case"} needs.`;
      }
    }

    // ── Rule 5: High API spend without cost controls ─────────────────────────
    else if (
      (toolId === "anthropic-api" || toolId === "openai-api" || row.plan === "api") &&
      row.monthlySpend > 500
    ) {
      const potentialSaving = Math.round(row.monthlySpend * 0.2);
      monthlySavings = potentialSaving;
      suggestedSpend = row.monthlySpend - potentialSaving;
      severity = "warning";
      insight = `API spend of $${row.monthlySpend.toFixed(0)}/mo is significant. Without spend caps and model tiering, waste is common.`;
      action = "Implement prompt caching, use lighter models (Haiku/GPT-4o-mini) for simple tasks, and set hard monthly budget alerts.";
    }

    // ── Rule 6: All good ──────────────────────────────────────────────────────
    else {
      severity = "good";
      insight = `${toolMeta.name} spend looks well-calibrated for ${row.seats} seat(s) at $${row.monthlySpend.toFixed(0)}/mo.`;
      action = "No immediate action needed. Review quarterly.";
    }

    recommendations.push({
      toolId,
      toolName: toolMeta.name,
      currentSpend: row.monthlySpend,
      suggestedSpend,
      monthlySavings,
      severity,
      insight,
      action,
    });
  }

  // ─── Overlap detection ─────────────────────────────────────────────────────
  const activeToolIds = new Set(validTools.map((t) => t.toolId as ToolId));
  for (const group of OVERLAP_GROUPS) {
    const overlapping = group.filter((id) => activeToolIds.has(id));
    if (overlapping.length >= 2) {
      // Flag the highest-spend one as potentially redundant
      const overlappingRows = validTools.filter((t) =>
        overlapping.includes(t.toolId as ToolId)
      );
      overlappingRows.sort((a, b) => b.monthlySpend - a.monthlySpend);
      const topRow = overlappingRows[0];
      const existing = recommendations.find((r) => r.toolId === topRow.toolId);
      if (existing && existing.severity === "good") {
        const names = overlapping
          .map((id) => getToolMeta(id)?.name ?? id)
          .join(", ");
        existing.severity = "warning";
        existing.insight = `You are paying for ${names} which serve overlapping functions. ${existing.insight}`;
        existing.action = `Consolidate to one primary ${group.includes("cursor") ? "coding assistant" : group.includes("anthropic-api") ? "API provider" : "chat tool"} to eliminate redundant spend.`;
        const overlapSaving = Math.round(topRow.monthlySpend * 0.5);
        existing.monthlySavings = Math.max(existing.monthlySavings, overlapSaving);
        existing.suggestedSpend = topRow.monthlySpend - overlapSaving;
      }
    }
  }

  // ─── Aggregate numbers ─────────────────────────────────────────────────────
  const totalMonthlySpend = validTools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0
  );
  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Efficiency score: 100 - (savings% of spend * 100), clamped 0-100
  const efficiencyScore =
    totalMonthlySpend > 0
      ? Math.max(
          0,
          Math.min(100, Math.round(100 - (totalMonthlySavings / totalMonthlySpend) * 100))
        )
      : 100;

  // ─── Summary message ───────────────────────────────────────────────────────
  const showCredexCTA = totalMonthlySavings > 500;
  const isSpendingWell = totalMonthlySavings < 100 && totalMonthlySpend > 0;

  let summaryMessage = "";
  if (isSpendingWell) {
    summaryMessage =
      "You're spending well! Your AI stack is lean and well-optimised. Minor tweaks could still compound over time.";
  } else if (showCredexCTA) {
    summaryMessage = `Our analysis found $${totalMonthlySavings.toFixed(0)}/mo ($${totalAnnualSavings.toFixed(0)}/yr) in potential savings. A Credex consultation could help you act on these in days, not months.`;
  } else {
    summaryMessage = `We found $${totalMonthlySavings.toFixed(0)}/mo in potential savings across your AI stack. Apply the recommendations below to trim your spend.`;
  }

  return {
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    efficiencyScore,
    recommendations,
    summaryMessage,
    showCredexCTA,
    isSpendingWell,
  };
}
