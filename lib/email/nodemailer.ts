import nodemailer from "nodemailer";

interface SendVerificationEmailOptions {
  to: string;
  name: string;
  token: string;
}

export function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";

  if (!user || !pass) {
    console.warn("SMTP credentials not fully configured in environment variables. Email logging fallback active.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendVerificationEmail({ to, name, token }: SendVerificationEmailOptions): Promise<boolean> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sarthitourism.com").replace(/\/+$/, '');
  const verificationUrl = `${siteUrl}/api/auth/verify-email?token=${token}`;
  const fromEmail = process.env.SMTP_FROM || `"Sarthi Tourism" <noreply@sarthitourism.com>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Sarthi Tourism</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b1120; color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #93c5fd; margin-top: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px 30px; text-align: center; }
    .greeting { font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 16px; text-align: left; }
    .text { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; text-align: left; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 16px 36px; border-radius: 9999px; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(37,99,235,0.4); transition: all 0.3s ease; }
    .link-box { background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-top: 30px; font-size: 12px; color: #94a3b8; word-break: break-all; }
    .footer { padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sarthi Tourism</h1>
      <p>Explore The World In Comfort</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${name || 'Traveler'},</div>
      <div class="text">
        Welcome to Sarthi Tourism! Please verify your email address to activate your account and start exploring our curated holiday packages.
      </div>
      <div>
        <a href="${verificationUrl}" target="_blank" class="btn">Verify Email Address</a>
      </div>
      <div class="text" style="margin-top: 30px; font-size: 13px; color: #94a3b8;">
        This verification link will expire in 24 hours. If you did not create an account with Sarthi Tourism, you can safely ignore this email.
      </div>
      <div class="link-box">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${verificationUrl}" style="color: #60a5fa;">${verificationUrl}</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Sarthi Tourism. All rights reserved.<br>
      Gujarat, India.
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = getTransporter();
    
    // If SMTP user is configured, send the real email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: fromEmail,
        to,
        subject: "Verify Your Email - Sarthi Tourism",
        html,
      });
      console.log(`[Nodemailer] Verification email sent to ${to}`);
    } else {
      // Development fallback logging if SMTP env is not yet populated
      console.log(`[Nodemailer Mock] Verification link for ${to}: ${verificationUrl}`);
    }

    return true;
  } catch (error) {
    console.error("[Nodemailer Error] Failed to send verification email:", error);
    return false;
  }
}
