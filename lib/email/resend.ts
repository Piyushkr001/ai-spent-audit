import { Resend } from "resend";

export async function sendAuditConfirmationEmail(
  toEmail: string,
  reportUrl: string,
  monthlySavings: number,
  annualSavings: number,
  showCredexCTA: boolean
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY set. Skipping email.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const savingsText = monthlySavings > 0 
    ? `We found $${monthlySavings} in potential monthly savings ($${annualSavings} annually) across your AI tools.`
    : `Your AI tool spend looks well-optimised!`;

  const credexNote = showCredexCTA 
    ? `\n\nBecause your potential savings are significant, you are eligible for a free Credex consultation to help you implement these savings and unlock further credits.`
    : "";

  const textBody = `Hi there,

Your AI spend audit is complete and your report is ready.

${savingsText}${credexNote}

View your full report here: ${reportUrl}

Best regards,
The SpendLens AI Team`;

  try {
    await resend.emails.send({
      from: "SpendLens AI <onboarding@resend.dev>",
      to: toEmail,
      subject: "Your AI Spend Audit Report",
      text: textBody,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
