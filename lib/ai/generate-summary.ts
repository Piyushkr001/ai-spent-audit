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
    
    const prompt = `You are an expert SaaS procurement analyst. Provide a personalized, empathetic, and professional summary (approximately 100 words) of the following AI tool spend audit. Do not perform any math.
    
Team Size: ${form.teamSize}
Primary Use Case: ${form.useCase}
Current Monthly Spend: $${auditResult.totalMonthlySpend}
Potential Monthly Savings: $${auditResult.totalMonthlySavings}

Tools Audited:
${auditResult.recommendations.map(r => `- ${r.toolName}: spend $${r.currentSpend}, suggested $${r.suggestedSpend}. Action: ${r.action}`).join("\n")}
`;

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
