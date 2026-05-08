// ─── Tool IDs ──────────────────────────────────────────────────────────────────
export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf"
  | "v0";

// ─── Plan tiers per tool ──────────────────────────────────────────────────────
export type CursorPlan = "hobby" | "pro" | "business";
export type GithubCopilotPlan = "individual" | "business" | "enterprise";
export type ClaudePlan = "free" | "pro" | "team" | "api";
export type ChatGPTPlan = "free" | "plus" | "team" | "enterprise";
export type AnthropicApiPlan = "pay-as-you-go" | "scale";
export type OpenAiApiPlan = "pay-as-you-go" | "tier1" | "tier2";
export type GeminiPlan = "free" | "advanced" | "business" | "api";
export type WindsurfPlan = "free" | "pro" | "team";
export type V0Plan = "free" | "premium" | "team";

export type ToolPlan =
  | CursorPlan
  | GithubCopilotPlan
  | ClaudePlan
  | ChatGPTPlan
  | AnthropicApiPlan
  | OpenAiApiPlan
  | GeminiPlan
  | WindsurfPlan
  | V0Plan;

// ─── Primary use cases ────────────────────────────────────────────────────────
export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

// ─── A single AI tool entry in the form ──────────────────────────────────────
export interface ToolRow {
  id: string; // uuid for React key management
  toolId: ToolId | "";
  plan: ToolPlan | "";
  monthlySpend: number;
  seats: number;
}

// ─── The full form state ──────────────────────────────────────────────────────
export interface AuditFormState {
  teamSize: number;
  useCase: UseCase | "";
  tools: ToolRow[];
  /** ISO 4217 currency code — e.g. "USD", "INR". Defaults to auto-detected. */
  currencyCode: string;
}

// ─── Per-tool recommendation ──────────────────────────────────────────────────
export type SeverityLevel = "critical" | "warning" | "info" | "good";

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentSpend: number;
  suggestedSpend: number;
  monthlySavings: number;
  severity: SeverityLevel;
  insight: string;
  action: string;
}

// ─── Full audit result ────────────────────────────────────────────────────────
export interface AuditResult {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  efficiencyScore: number; // 0–100
  recommendations: ToolRecommendation[];
  summaryMessage: string;
  showCredexCTA: boolean;
  isSpendingWell: boolean;
}
