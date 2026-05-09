import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai/generate-summary";

export async function POST(req: Request) {
  try {
    const { form, auditResult } = await req.json();
    if (!form || !auditResult) {
      return NextResponse.json({ error: "Missing form or auditResult" }, { status: 400 });
    }

    const summary = await generateSummary(form, auditResult);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error in summary route:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
