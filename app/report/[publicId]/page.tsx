import { db } from "@/db";
import { audits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AuditResults } from "@/app/audit/_components/AuditResults";
import { getCurrencyByCode } from "@/lib/audit/currency";
import type { AuditResult } from "@/lib/audit/types";

export async function generateMetadata({ params }: { params: Promise<{ publicId: string }> }) {
  const resolvedParams = await params;
  const audit = await db.query.audits.findFirst({
    where: eq(audits.publicId, resolvedParams.publicId),
  });

  if (!audit) return { title: "Report Not Found" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return {
    title: `AI Spend Audit Report - $${audit.totalAnnualSavings} Found`,
    description: audit.summary,
    openGraph: {
      title: `AI Spend Audit Report`,
      description: audit.summary,
      url: `${appUrl}/report/${resolvedParams.publicId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Spend Audit Report`,
      description: audit.summary,
    },
  };
}

export default async function ReportPage({ params }: { params: Promise<{ publicId: string }> }) {
  const resolvedParams = await params;
  const audit = await db.query.audits.findFirst({
    where: eq(audits.publicId, resolvedParams.publicId),
  });

  if (!audit) {
    notFound();
  }

  // Assuming USD internally for saved reports as stated in earlier requirements
  const currency = getCurrencyByCode("USD");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Spend Audit Report
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Report ID: <span className="font-mono">{audit.publicId}</span>
          </p>
        </div>
        
        {/* Render the shared component with the saved payload */}
        <AuditResults result={audit.publicPayload as AuditResult} currency={currency} hideSaveAction={true} />
      </div>
    </div>
  );
}
