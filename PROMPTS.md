# PROMPTS.md

## Project: SpendLens AI

SpendLens AI is a free AI spend audit tool built for the Credex WebDev 2026 assignment. The product helps startup founders, CTOs, and engineering managers review their AI tool spending, identify overspending, compare current plans with better-fit alternatives, and estimate monthly and annual savings.

This file documents the LLM prompt used in the product, why it was written this way, and how the fallback behavior works.

---

## Where AI is used

AI is used only for generating a short personalized audit summary after the deterministic audit engine has already calculated the result.

AI is **not** used for the financial calculations, pricing comparisons, savings math, or recommendation rules.

The audit engine is rule-based and deterministic because pricing and savings recommendations must be explainable, testable, and defensible.

---

## Why the audit math is not AI-generated

The audit calculation uses hardcoded pricing metadata and deterministic rules because:

1. Pricing recommendations should be consistent for the same input.
2. Savings calculations must be traceable to official pricing data.
3. LLMs can hallucinate prices, plans, or unsupported claims.
4. Finance-related recommendations need predictable logic.
5. The output should remain testable with automated unit tests.

The LLM is only used to convert the already-computed result into a readable summary paragraph.

---

## Summary generation prompt

The following prompt is used to generate a personalized summary of around 100 words.

```txt
You are writing a concise AI spend audit summary for a startup founder, CTO, or engineering manager.

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
{{AUDIT_RESULT_JSON}}

Write one personalized summary paragraph.
```

## Fallback Behavior

If the Gemini API key is missing or the request fails (e.g., due to rate limits), the system automatically falls back to `getFallbackSummary()`. This ensures the user still gets a fast, deterministic summary of their savings without crashing the app.

## Why this prompt?

The prompt was heavily optimized to enforce strict constraints. Early testing showed that LLMs could easily hallucinate AI tools or generate incorrect math. By stating explicitly "Do not invent pricing" and "Do not change calculated savings", the prompt forces the LLM to strictly act as a summarizer of the JSON data rather than a calculator.

## What was tried and rejected?

- **Generating the entire audit using an LLM**: Rejected. LLMs cannot be trusted to perfectly reproduce pricing tiers or math logic for financial decisions.
- **Passing the raw HTML/DOM to the LLM**: Rejected. It consumed too many tokens and led to slower generation times and occasional hallucinations. Instead, the deterministic engine generates a clean `AUDIT_RESULT_JSON` payload.