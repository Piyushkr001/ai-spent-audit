import type { ToolId, ToolPlan } from "./types";

// ─── Tool metadata ─────────────────────────────────────────────────────────────
export interface ToolMeta {
  id: ToolId;
  name: string;
  category: "ide" | "chat" | "api" | "design";
  plans: PlanMeta[];
}

export interface PlanMeta {
  id: ToolPlan;
  label: string;
  pricePerSeat: number; // USD / month / seat  (0 = free, -1 = variable/API)
  isFreeOrAPI?: boolean;
}

// ─── Canonical pricing (Keep synchronized with PRICING_DATA.md) ──────────────────────────────────
export const TOOLS: ToolMeta[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "ide",
    plans: [
      { id: "hobby",    label: "Hobby (Free)",  pricePerSeat: 0, isFreeOrAPI: true },
      { id: "pro",      label: "Pro",            pricePerSeat: 20 },
      { id: "business", label: "Business",       pricePerSeat: 40 },
      { id: "enterprise", label: "Enterprise",   pricePerSeat: 39 },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "ide",
    plans: [
      { id: "individual",  label: "Individual",  pricePerSeat: 10 },
      { id: "business",    label: "Business",    pricePerSeat: 19 },
      { id: "enterprise",  label: "Enterprise",  pricePerSeat: 39 },
    ],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    category: "chat",
    plans: [
      { id: "free", label: "Free",          pricePerSeat: 0, isFreeOrAPI: true },
      { id: "pro",  label: "Pro",           pricePerSeat: 20 },
      { id: "team", label: "Team",          pricePerSeat: 25 },
      { id: "api",  label: "API (Custom)",  pricePerSeat: -1, isFreeOrAPI: true },
      { id: "max",  label: "Max",           pricePerSeat: 50 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: -1 },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    category: "chat",
    plans: [
      { id: "free",       label: "Free",        pricePerSeat: 0, isFreeOrAPI: true },
      { id: "plus",       label: "Plus",        pricePerSeat: 20 },
      { id: "team",       label: "Team",        pricePerSeat: 25 },
      { id: "enterprise", label: "Enterprise",  pricePerSeat: -1, isFreeOrAPI: true },
      { id: "api",        label: "API (Direct)", pricePerSeat: -1, isFreeOrAPI: true },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API (Direct)",
    category: "api",
    plans: [
      { id: "pay-as-you-go", label: "Pay-as-you-go", pricePerSeat: -1, isFreeOrAPI: true },
      { id: "scale",         label: "Scale",          pricePerSeat: -1, isFreeOrAPI: true },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API (Direct)",
    category: "api",
    plans: [
      { id: "pay-as-you-go", label: "Pay-as-you-go", pricePerSeat: -1, isFreeOrAPI: true },
      { id: "tier1",         label: "Tier 1",         pricePerSeat: -1, isFreeOrAPI: true },
      { id: "tier2",         label: "Tier 2",         pricePerSeat: -1, isFreeOrAPI: true },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "chat",
    plans: [
      { id: "free",     label: "Free",        pricePerSeat: 0, isFreeOrAPI: true },
      { id: "advanced", label: "Advanced",    pricePerSeat: 19.99 },
      { id: "business", label: "Business",    pricePerSeat: 22 },
      { id: "api",      label: "API (Custom)", pricePerSeat: -1, isFreeOrAPI: true },
      { id: "pro",      label: "Pro",         pricePerSeat: 20 },
      { id: "ultra",    label: "Ultra",       pricePerSeat: 30 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "ide",
    plans: [
      { id: "free", label: "Free",  pricePerSeat: 0, isFreeOrAPI: true },
      { id: "pro",  label: "Pro",   pricePerSeat: 15 },
      { id: "team", label: "Team",  pricePerSeat: 30 },
    ],
  },
  {
    id: "v0",
    name: "v0 (Vercel)",
    category: "design",
    plans: [
      { id: "free",    label: "Free",    pricePerSeat: 0, isFreeOrAPI: true },
      { id: "premium", label: "Premium", pricePerSeat: 20 },
      { id: "team",    label: "Team",    pricePerSeat: 50 },
    ],
  },
];

// ─── Lookup helpers ────────────────────────────────────────────────────────────
export function getToolMeta(toolId: ToolId): ToolMeta | undefined {
  return TOOLS.find((t) => t.id === toolId);
}

export function getPlanMeta(
  toolId: ToolId,
  planId: ToolPlan
): PlanMeta | undefined {
  return getToolMeta(toolId)?.plans.find((p) => p.id === planId);
}

/** Returns expected monthly cost for a given tool/plan/seats combo. */
export function expectedMonthlyCost(
  toolId: ToolId,
  planId: ToolPlan,
  seats: number
): number | null {
  const plan = getPlanMeta(toolId, planId);
  if (!plan) return null;
  if (plan.pricePerSeat < 0) return null; // API — unknown
  return plan.pricePerSeat * Math.max(1, seats);
}
