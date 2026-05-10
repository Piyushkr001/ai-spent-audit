import { GoogleGenAI } from "@google/genai";
import type { AuditResult, AuditFormState } from "../audit/types";
import { getFallbackSummary } from "./fallback-summary";

export async function generateSummary(form: AuditFormState, auditResult: AuditResult): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    console.warn("No Gemini API key found, using fallback summary.");
    return getFallbackSummary(auditResult);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are writing a concise AI spend audit summary for a startup founder, CTO, or engineering manager.

Product context:
SpendLens AI audits a company's AI tool spending and identifies potential savings across tools such as Cursor, GitHub Copilot, Claude, ChatGPT, OpenAI API, Anthropic API, Gemini, Windsurf, and v0.

Important rules:
- Do not invent pricing.
- Do not invent tools.
- Do not change calculated savings.
- Do not claim guaranteed savings.
- Be clear, practical, and finance-literate.
- Keep the summary around 100 words.
- Write in a professional but accessible tone.
- Do not include private information such as email or company name.

Audit result:
${JSON.stringify({
  teamSize: form.teamSize,
  primaryUseCase: form.useCase,
  totalMonthlySpend: auditResult.totalMonthlySpend,
  totalMonthlySavings: auditResult.totalMonthlySavings,
  recommendations: auditResult.recommendations.map(r => ({
    toolName: r.toolName,
    currentSpend: r.currentSpend,
    suggestedSpend: r.suggestedSpend,
    action: r.action
  }))
}, null, 2)}

Write one personalized summary paragraph.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
    
    return getFallbackSummary(auditResult);
  } catch (error) {
    console.error("Failed to generate AI summary, using fallback:", error);
    return getFallbackSummary(auditResult);
  }
}
