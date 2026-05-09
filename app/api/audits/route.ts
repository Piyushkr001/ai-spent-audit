import { NextResponse } from "next/server";
import { db } from "@/db";
import { audits, leads } from "@/db/schema";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auditResult, form, email, companyName, role } = body;

    if (!auditResult || !form) {
      return NextResponse.json({ error: "Missing payload data" }, { status: 400 });
    }

    // Generate unique 8 character public ID
    const publicId = crypto.randomBytes(4).toString("hex");

    const auditData = {
      publicId,
      teamSize: form.teamSize,
      primaryUseCase: form.useCase || "mixed",
      totalMonthlySpend: auditResult.totalMonthlySpend,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      efficiencyScore: auditResult.efficiencyScore,
      summary: auditResult.summaryMessage,
      publicPayload: auditResult,
    };

    // Insert Audit
    const [insertedAudit] = await db.insert(audits).values(auditData).returning();

    // Insert Lead if email provided
    if (email) {
      await db.insert(leads).values({
        auditId: insertedAudit.id,
        email,
        companyName,
        role,
        teamSize: form.teamSize,
        monthlySavings: auditResult.totalMonthlySavings,
        isHighSavings: auditResult.showCredexCTA,
      });
    }

    return NextResponse.json({ publicId, url: `/report/${publicId}` });
  } catch (error) {
    console.error("Failed to save audit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
