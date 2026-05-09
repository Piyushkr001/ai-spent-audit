import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/audit/engine";
import type { AuditFormState } from "../lib/audit/types";

describe("Audit Engine", () => {
  it("calculates total monthly spend correctly", () => {
    const form: AuditFormState = {
      teamSize: 5,
      useCase: "coding",
      currencyCode: "USD",
      tools: [
        { id: "1", toolId: "cursor", plan: "pro", seats: 3, monthlySpend: 60 },
        { id: "2", toolId: "chatgpt", plan: "plus", seats: 2, monthlySpend: 40 },
      ],
    };

    const result = runAudit(form);
    expect(result.totalMonthlySpend).toBe(100);
  });

  it("calculates annual savings correctly based on overpaying", () => {
    // 3 Cursor Pro seats expected to cost $60 (3 * $20). If spending $120, overpaying by $60/mo
    const form: AuditFormState = {
      teamSize: 5,
      useCase: "coding",
      currencyCode: "USD",
      tools: [
        { id: "1", toolId: "cursor", plan: "pro", seats: 3, monthlySpend: 120 },
      ],
    };

    const result = runAudit(form);
    expect(result.totalMonthlySpend).toBe(120);
    expect(result.totalMonthlySavings).toBe(60);
    expect(result.totalAnnualSavings).toBe(720);
  });

  it("handles low savings / already optimal case", () => {
    const form: AuditFormState = {
      teamSize: 2,
      useCase: "coding",
      currencyCode: "USD",
      tools: [
        { id: "1", toolId: "cursor", plan: "pro", seats: 2, monthlySpend: 40 },
      ],
    };

    const result = runAudit(form);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isSpendingWell).toBe(true);
    expect(result.showCredexCTA).toBe(false);
    expect(result.summaryMessage).toContain("You're spending well!");
  });

  it("shows Credex CTA for high savings cases", () => {
    const form: AuditFormState = {
      teamSize: 10,
      useCase: "coding",
      currencyCode: "USD",
      tools: [
        { id: "1", toolId: "github-copilot", plan: "enterprise", seats: 10, monthlySpend: 1000 },
        { id: "2", toolId: "cursor", plan: "business", seats: 10, monthlySpend: 800 },
      ],
    };

    // overlapping tools (github-copilot and cursor).
    // top spend is $1000 (github-copilot), overlap savings will be 50% = 500
    // github-copilot expected cost is 10 * 39 = 390. Spending 1000 -> Overpay rule triggers first!
    // Overpay rule: 1000 - 390 = 610 savings.
    // Cursor expected cost is 10 * 40 = 400. Spending 800 -> Overpay rule: 800 - 400 = 400 savings.
    // Total savings should be > 500, triggering the Credex CTA.
    const result = runAudit(form);
    
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
    expect(result.showCredexCTA).toBe(true);
    expect(result.summaryMessage).toContain("Credex consultation");
  });

  it("recommends action for high API spend without cost controls", () => {
    const form: AuditFormState = {
      teamSize: 5,
      useCase: "mixed",
      currencyCode: "USD",
      tools: [
        { id: "1", toolId: "anthropic-api", plan: "pay-as-you-go", seats: 1, monthlySpend: 1000 },
      ],
    };

    const result = runAudit(form);
    const apiRecommendation = result.recommendations.find(r => r.toolId === "anthropic-api");
    
    expect(apiRecommendation).toBeDefined();
    expect(apiRecommendation?.severity).toBe("warning");
    expect(apiRecommendation?.insight).toContain("API spend");
    expect(apiRecommendation?.insight).toContain("significant");
    expect(apiRecommendation?.action).toContain("budget alerts");
    expect(result.totalMonthlySavings).toBe(200); // 20% of 1000 = 200
  });
});
