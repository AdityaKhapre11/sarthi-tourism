import nodemailer from "nodemailer";

interface SendOtpEmailOptions {
  to: string;
  name: string;
  otp: string;
}

interface SendContactEmailOptions {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface SendPasswordResetEmailOptions {
  to: string;
  name: string;
  resetUrl: string;
}

function getTransporter() {
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

export async function sendContactEmail({ name, email, phone, subject, message }: SendContactEmailOptions): Promise<boolean> {
  const adminEmail = process.env.SMTP_USER || "info@sarthitourism.com";
  const fromEmail = process.env.SMTP_FROM || `"Sarthi Tourism Website" <noreply@sarthitourism.com>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Premium Modern Email Template */
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #27272a; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
    
    .header { background: linear-gradient(135deg, #09090b, #27272a); padding: 40px 30px; text-align: center; position: relative; }
    .header-accent { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
    .header p { color: #a1a1aa; font-size: 13px; margin: 8px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; }
    
    .content { padding: 40px 30px; }
    
    .field-group { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f4f4f5; }
    .field-group:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    
    .label { font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px; display: block; }
    .value { font-size: 16px; color: #09090b; line-height: 1.5; font-weight: 500; }
    
    .message-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0; margin-top: 10px; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap; font-style: italic; }
    
    .footer { padding: 30px; text-align: center; font-size: 13px; color: #a1a1aa; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
    .footer-link { color: #3b82f6; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-accent"></div>
      <h1>New Inquiry</h1>
      <p>Sarthi Tourism Platform</p>
    </div>
    <div class="content">
      <div class="field-group">
        <span class="label">Contact Name</span>
        <div class="value">${name}</div>
      </div>
      
      <div class="field-group">
        <span class="label">Email Address</span>
        <div class="value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>
      </div>
      
      <div class="field-group">
        <span class="label">Mobile Number</span>
        <div class="value">${phone || 'Not provided'}</div>
      </div>
      
      <div class="field-group">
        <span class="label">Subject</span>
        <div class="value">${subject}</div>
      </div>
      
      <div class="field-group">
        <span class="label">Message Content</span>
        <div class="message-box">${message}</div>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">This is an automated notification from the <a href="#" class="footer-link">Sarthi Tourism</a> platform.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = getTransporter();
    
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        html,
      });
      console.log(`[Nodemailer] Contact email sent to ${adminEmail} from ${email}`);
    } else {
      console.log(`[Nodemailer Mock] Contact Form Submission from ${email} - Subject: ${subject}`);
    }

    return true;
  } catch (error) {
    console.error("[Nodemailer Error] Failed to send contact email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail({ to, name, resetUrl }: SendPasswordResetEmailOptions): Promise<boolean> {
  const fromEmail = process.env.SMTP_FROM || `"Sarthi Tourism" <noreply@sarthitourism.com>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Sarthi Tourism</title>
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
      <p>Password Recovery</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${name || 'Traveler'},</div>
      <div class="text">
        We received a request to reset your password. Click the button below to choose a new password.
      </div>
      <div>
        <a href="${resetUrl}" target="_blank" class="btn">Reset Password</a>
      </div>
      <div class="text" style="margin-top: 30px; font-size: 13px; color: #94a3b8;">
        This reset link is valid for 24 hours. If you did not request a password reset, you can safely ignore this email and your password will remain unchanged.
      </div>
      <div class="link-box">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${resetUrl}" style="color: #60a5fa;">${resetUrl}</a>
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
    
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: fromEmail,
        to,
        subject: "Reset Your Password - Sarthi Tourism",
        html,
      });
      console.log(`[Nodemailer] Password reset email sent to ${to}`);
    } else {
      console.log(`[Nodemailer Mock] Password reset link for ${to}: ${resetUrl}`);
    }

    return true;
  } catch (error) {
    console.error("[Nodemailer Error] Failed to send password reset email:", error);
    return false;
  }
}

export async function sendOtpEmail({ to, name, otp }: SendOtpEmailOptions): Promise<boolean> {
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
    .otp-box { display: inline-block; background-color: #0f172a; border: 1px solid #3b82f6; border-radius: 12px; padding: 16px 40px; font-size: 32px; font-weight: 800; letter-spacing: 12px; color: #60a5fa; margin: 10px 0 30px; }
    .footer { padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sarthi Tourism</h1>
      <p>Email Verification</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${name || 'Traveler'},</div>
      <div class="text">
        Please use the following 6-digit code to verify your email address and activate your account.
      </div>
      <div class="otp-box">${otp}</div>
      <div class="text" style="font-size: 13px; color: #94a3b8; text-align: center;">
        This verification code is valid for <strong>10 minutes</strong>. If you did not create an account, you can safely ignore this email.
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
    
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: fromEmail,
        to,
        subject: "Your Verification Code - Sarthi Tourism",
        html,
      });
      console.log(`[Nodemailer] OTP email sent to ${to}`);
    } else {
      console.log(`[Nodemailer Mock] OTP for ${to}: ${otp}`);
    }

    return true;
  } catch (error) {
    console.error("[Nodemailer Error] Failed to send OTP email:", error);
    return false;
  }
}
