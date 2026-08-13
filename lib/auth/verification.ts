import crypto from "crypto";

export interface GeneratedToken {
  rawToken: string;
  hashedToken: string;
  expiresAt: string;
}

export function generateVerificationToken(): GeneratedToken {
  // Generate 32 bytes of cryptographically secure random bytes
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash raw token using SHA-256 before saving to database
  const hashedToken = hashToken(rawToken);

  // Set token expiration to 24 hours from now
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return { rawToken, hashedToken, expiresAt };
}

export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
