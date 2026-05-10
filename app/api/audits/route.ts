import { NextResponse } from "next/server";
import { db } from "@/db";
import { audits, leads } from "@/db/schema";
import crypto from "crypto";
import { runAudit } from "@/lib/audit/engine";
import { generateSummary } from "@/lib/ai/generate-summary";
import { sendAuditConfirmationEmail } from "@/lib/email/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { form, email, companyName, role, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ publicId: "silent-success", url: "/report/silent-success" });
    }

    if (!form || !email) {
      return NextResponse.json({ error: "Missing required fields (form or email)" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!form.tools || !Array.isArray(form.tools) || form.tools.length === 0 || !form.tools.some((t: { toolId: string; monthlySpend: number }) => t.toolId && t.monthlySpend > 0)) {
      return NextResponse.json({ error: "Invalid tools" }, { status: 400 });
    }

    if (typeof form.teamSize !== 'number' || form.teamSize <= 0) {
      return NextResponse.json({ error: "Invalid team size" }, { status: 400 });
    }

    // Server-side audit computation
    const auditResult = runAudit(form);
    
    // Generate AI Summary (fallback built-in)
    const summary = await generateSummary(form, auditResult);
    auditResult.summaryMessage = summary;

    // Generate unique 16 character public ID (8 bytes = 16 hex chars)
    const publicId = crypto.randomBytes(8).toString("hex");

    const auditData = {
      publicId,
      teamSize: form.teamSize,
      primaryUseCase: form.useCase || "mixed",
      totalMonthlySpend: auditResult.totalMonthlySpend.toString(),
      totalMonthlySavings: auditResult.totalMonthlySavings.toString(),
      totalAnnualSavings: auditResult.totalAnnualSavings.toString(),
      efficiencyScore: auditResult.efficiencyScore,
      summary,
      publicPayload: auditResult,
    };

    // Insert Audit
    const [insertedAudit] = await db.insert(audits).values(auditData).returning();

    // Insert Lead
    await db.insert(leads).values({
      auditId: insertedAudit.id,
      email,
      companyName,
      role,
      teamSize: form.teamSize,
      monthlySavings: auditResult.totalMonthlySavings.toString(),
      isHighSavings: auditResult.showCredexCTA,
    });
    
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${publicId}`;
    
    // Send email
    await sendAuditConfirmationEmail(
      email,
      fullUrl,
      auditResult.totalMonthlySavings,
      auditResult.totalAnnualSavings,
      auditResult.showCredexCTA
    );

    return NextResponse.json({ publicId, url: `/report/${publicId}` });
  } catch (error) {
    console.error("Failed to save audit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
