import type { AuditResult } from "../audit/types";

export function getFallbackSummary(auditResult: AuditResult): string {
  return auditResult.summaryMessage;
}
