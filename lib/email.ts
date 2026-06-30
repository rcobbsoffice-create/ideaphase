import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = `${process.env.RESEND_FROM_NAME ?? 'IdeaPhase'} <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ─── Shared styles ────────────────────────────────────────────────────────────
const base = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>IdeaPhase</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding:0 0 28px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#3B82F6;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#fff;font-size:20px;font-weight:900;line-height:36px;">⚡</span>
              </td>
              <td style="padding-left:10px;color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">IdeaPhase</td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#0D0D16;border:1px solid #1E1E2E;border-radius:16px;padding:36px;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0 0;text-align:center;color:#4B4B62;font-size:12px;line-height:1.6;">
          You're receiving this because you have an account with IdeaPhase.<br/>
          &copy; ${new Date().getFullYear()} IdeaPhase. All rights reserved.
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

const h1 = (text: string) =>
  `<h1 style="margin:0 0 8px 0;color:#F0F0FF;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${text}</h1>`

const p = (text: string) =>
  `<p style="margin:0 0 20px 0;color:#8B8BA7;font-size:15px;line-height:1.65;">${text}</p>`

const btn = (text: string, href: string) =>
  `<a href="${href}" style="display:inline-block;background:#3B82F6;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;margin:4px 0 24px 0;">${text}</a>`

const divider = () =>
  `<hr style="border:none;border-top:1px solid #1E1E2E;margin:24px 0;" />`

const small = (text: string) =>
  `<p style="margin:0;color:#4B4B62;font-size:12px;line-height:1.6;">${text}</p>`

// ─── Email senders ─────────────────────────────────────────────────────────────

export async function sendClientInviteEmail({
  to, name, inviteUrl,
}: { to: string; name: string; inviteUrl: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "You've been invited to IdeaPhase",
    html: base(`
      ${h1(`Hey ${name.split(' ')[0]}, you're invited! 👋`)}
      ${p("Your workspace is ready on IdeaPhase — the client portal where you can track your project progress, view mockups, and pay invoices all in one place.")}
      ${btn('Set Up Your Account', inviteUrl)}
      ${divider()}
      ${small(`If you didn't expect this, you can safely ignore this email. The link expires in 24 hours.`)}
    `),
  })
}

export async function sendInvoiceEmail({
  to, clientName, invoiceTitle, amountDollars, dueDate, invoiceId,
}: {
  to: string
  clientName: string
  invoiceTitle: string
  amountDollars: string
  dueDate?: string | null
  invoiceId: string
}) {
  const payUrl = `${APP_URL}/portal/invoices`
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Invoice: ${invoiceTitle} — $${amountDollars}`,
    html: base(`
      ${h1('You have a new invoice')}
      ${p(`Hi ${clientName.split(' ')[0]}, a new invoice has been created for you.`)}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;border:1px solid #1E1E2E;border-radius:10px;padding:20px;margin-bottom:24px;">
        <tr>
          <td style="color:#8B8BA7;font-size:13px;padding-bottom:8px;">Invoice</td>
          <td style="color:#F0F0FF;font-size:13px;font-weight:600;text-align:right;">${invoiceTitle}</td>
        </tr>
        <tr>
          <td style="color:#8B8BA7;font-size:13px;padding-bottom:8px;">Amount Due</td>
          <td style="color:#3B82F6;font-size:20px;font-weight:700;text-align:right;">$${amountDollars}</td>
        </tr>
        ${dueDate ? `<tr><td style="color:#8B8BA7;font-size:13px;">Due Date</td><td style="color:#F59E0B;font-size:13px;font-weight:600;text-align:right;">${new Date(dueDate).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</td></tr>` : ''}
      </table>
      ${btn('Pay Now →', payUrl)}
      ${divider()}
      ${small('You can view all your invoices anytime from your client portal.')}
    `),
  })
}

export async function sendProjectUpdateEmail({
  to, clientName, projectName, updateTitle, updateContent,
}: {
  to: string
  clientName: string
  projectName: string
  updateTitle: string
  updateContent?: string | null
}) {
  const portalUrl = `${APP_URL}/portal`
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Update on ${projectName}: ${updateTitle}`,
    html: base(`
      ${h1('Project update')}
      ${p(`Hi ${clientName.split(' ')[0]}, there's a new update on your project <strong style="color:#F0F0FF;">${projectName}</strong>.`)}
      <div style="background:#0A0A0F;border-left:3px solid #3B82F6;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 6px 0;color:#F0F0FF;font-size:15px;font-weight:600;">${updateTitle}</p>
        ${updateContent ? `<p style="margin:0;color:#8B8BA7;font-size:14px;line-height:1.6;">${updateContent}</p>` : ''}
      </div>
      ${btn('View in Portal', portalUrl)}
      ${divider()}
      ${small('Log in to your portal to see full project details and history.')}
    `),
  })
}

export async function sendPaymentConfirmedEmail({
  to, clientName, invoiceTitle, amountDollars,
}: {
  to: string
  clientName: string
  invoiceTitle: string
  amountDollars: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Payment received — $${amountDollars}`,
    html: base(`
      ${h1('Payment confirmed ✓')}
      ${p(`Hi ${clientName.split(' ')[0]}, we've received your payment. Thank you!`)}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;border:1px solid #1E1E2E;border-radius:10px;padding:20px;margin-bottom:24px;">
        <tr>
          <td style="color:#8B8BA7;font-size:13px;padding-bottom:8px;">Invoice</td>
          <td style="color:#F0F0FF;font-size:13px;font-weight:600;text-align:right;">${invoiceTitle}</td>
        </tr>
        <tr>
          <td style="color:#8B8BA7;font-size:13px;">Amount Paid</td>
          <td style="color:#10B981;font-size:20px;font-weight:700;text-align:right;">$${amountDollars}</td>
        </tr>
      </table>
      <p style="margin:0 0 24px 0;color:#8B8BA7;font-size:15px;line-height:1.65;">
        A receipt has been saved to your portal. We appreciate your business and look forward to continuing our work together.
      </p>
      ${btn('View Portal', `${APP_URL}/portal/invoices`)}
      ${divider()}
      ${small('Keep this email as your payment confirmation.')}
    `),
  })
}
