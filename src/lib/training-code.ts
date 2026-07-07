import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// Excludes ambiguous characters: 0/O, 1/I/L
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateTrainingCode(): string {
  const chunk = (len: number) =>
    Array.from(randomBytes(len))
      .map((b) => CHARSET[b % CHARSET.length])
      .join("");
  return `ALGO-${chunk(4)}-${chunk(4)}`;
}

export function normalizeTrainingCode(code: string): string {
  return code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export function formatTrainingCode(code: string): string {
  const normalized = normalizeTrainingCode(code);
  if (normalized.length !== 12 || !normalized.startsWith("ALGO")) {
    return code.toUpperCase();
  }
  return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8, 12)}`;
}

export function codeLookupKey(normalizedCode: string): string {
  return createHash("sha256").update(normalizedCode).digest("hex");
}

export function codeHint(normalizedCode: string): string {
  return normalizedCode.slice(-4);
}

export async function hashTrainingCode(normalizedCode: string): Promise<string> {
  return bcrypt.hash(normalizedCode, 12);
}

export async function verifyTrainingCode(
  normalizedCode: string,
  codeHash: string
): Promise<boolean> {
  return bcrypt.compare(normalizedCode, codeHash);
}

export function isValidCodeFormat(code: string): boolean {
  const normalized = normalizeTrainingCode(code);
  return /^ALGO[A-Z0-9]{8}$/.test(normalized);
}
