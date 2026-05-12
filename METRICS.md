# Metrics

## North Star Metric
**Total Annual Savings Identified**: The total dollar amount of savings across all completed audits. This metric proves the core value of the product to both users and Credex.

## Input Metrics
1. **Landing to Audit Conversion Rate**: The percentage of landing page visitors who click "Run Free Audit".
2. **Average Team Size Audited**: Tracks the maturity of our target audience. We want to attract companies with >10 employees for maximum Credex impact.
3. **Email Capture Rate**: The percentage of users who complete the audit and successfully submit their email to save the report.

## What to Instrument First
The **Email Capture Rate** must be instrumented immediately (e.g., using PostHog or Vercel Web Analytics). If users run the audit but abandon the form before saving the report, the lead generation engine fails entirely.

## Pivot Threshold
If the **Email Capture Rate** drops below **10%** of completed audits, we must pivot the UX. Potential pivots include gating the final deterministic results behind the email capture, or drastically reducing the number of input fields required to get started.
