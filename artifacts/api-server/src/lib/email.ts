import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://eliteledgercapital.com";
const FROM = "Elite Ledger Capital <support@eliteledgercapital.com>";

export async function sendWelcomeEmail(user: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  address?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  zipCode?: string | null;
  plan?: string | null;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — welcome email skipped for", user.email);
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  const planLabel = user.plan
    ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan`
    : "No plan selected — you can choose one after logging in";

  const addressParts = [user.address, user.city, user.stateProvince, user.zipCode, user.country].filter(Boolean);
  const fullAddress = addressParts.length ? addressParts.join(", ") : "Not provided";

  const html = buildWelcomeEmailHtml({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "Not provided",
    address: fullAddress,
    planLabel,
    loginUrl: `${FRONTEND_URL}/login`,
  });

  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Welcome to Elite Ledger Capital — Your Account Has Been Approved",
    html,
  });

  console.log("Welcome email sent to", user.email);
}

function buildWelcomeEmailHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  planLabel: string;
  loginUrl: string;
}): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Welcome to Elite Ledger Capital</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#111111 0%,#1a1500 100%);padding:40px 40px 30px;text-align:center;border-bottom:2px solid #d4af37;">
            <div style="font-size:11px;letter-spacing:4px;color:#d4af37;text-transform:uppercase;margin-bottom:8px;">Premium Investment Platform</div>
            <div style="font-size:26px;font-weight:700;color:#d4af37;letter-spacing:2px;">ELITE LEDGER CAPITAL</div>
            <div style="width:60px;height:2px;background:#d4af37;margin:16px auto 0;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="font-size:22px;font-weight:600;color:#ffffff;margin:0 0 8px;">Welcome, ${data.firstName}!</p>
            <p style="font-size:15px;color:#a0a0a0;margin:0 0 28px;line-height:1.6;">
              We are delighted to inform you that your Elite Ledger Capital account has been reviewed and
              <span style="color:#d4af37;font-weight:600;">approved</span>.
              You now have full access to your investment dashboard.
            </p>

            <!-- Account Details -->
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:24px;margin-bottom:28px;">
              <div style="font-size:11px;letter-spacing:3px;color:#d4af37;text-transform:uppercase;margin-bottom:16px;">Your Account Details</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:13px;width:42%;vertical-align:top;">Full Name</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:13px;font-weight:500;">${data.firstName} ${data.lastName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:13px;vertical-align:top;">Email Address</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:13px;font-weight:500;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:13px;vertical-align:top;">Phone Number</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:13px;font-weight:500;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:13px;vertical-align:top;">Address</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:13px;font-weight:500;">${data.address}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Investment Plan</td>
                  <td style="padding:10px 0;color:#d4af37;font-size:13px;font-weight:600;">${data.planLabel}</td>
                </tr>
              </table>
            </div>

            <!-- Trial Notice -->
            <div style="background:#1a1500;border:1px solid #3a2f00;border-left:3px solid #d4af37;border-radius:6px;padding:16px;margin-bottom:32px;">
              <div style="color:#d4af37;font-size:13px;font-weight:600;margin-bottom:4px;">3-Day Free Trial Active</div>
              <div style="color:#a0a0a0;font-size:13px;line-height:1.5;">
                Your trial period has started. Explore the full platform and all features — no commitment required during this period.
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${data.loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#d4af37,#b8960c);color:#000000;font-weight:700;font-size:15px;text-decoration:none;padding:14px 44px;border-radius:6px;letter-spacing:1px;">
                LOGIN TO YOUR DASHBOARD
              </a>
            </div>

            <p style="font-size:13px;color:#666;line-height:1.7;margin:0;">
              If you have any questions or need assistance, our support team is ready to help at
              <a href="mailto:support@eliteledgercapital.com" style="color:#d4af37;text-decoration:none;">support@eliteledgercapital.com</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0d0d0d;padding:24px 40px;border-top:1px solid #222;text-align:center;">
            <div style="font-size:12px;color:#444;line-height:1.8;">
              &copy; ${year} Elite Ledger Capital. All rights reserved.<br>
              This email was sent to ${data.email} because you registered on our platform.
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
