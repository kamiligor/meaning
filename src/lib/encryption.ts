import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from "crypto";

const ITERATIONS = 600_000;
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // GCM standard
const SALT_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getAppSecret(): string {
  const secret = process.env.APP_SECRET;
  if (!secret) {
    throw new Error(
      "APP_SECRET is not set. This environment variable is required for encryption."
    );
  }
  return secret;
}

function deriveKey(userId: string, salt: Buffer): Buffer {
  return pbkdf2Sync(
    getAppSecret() + userId,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    "sha256"
  );
}

export function encrypt(
  plaintext: string,
  userId: string
): { ciphertext: string; iv: string; salt: string } {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(userId, salt);

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: Buffer.concat([encrypted, authTag]).toString("base64"),
    iv: iv.toString("base64"),
    salt: salt.toString("base64"),
  };
}

export function decrypt(
  ciphertextB64: string,
  ivB64: string,
  saltB64: string,
  userId: string
): string {
  const salt = Buffer.from(saltB64, "base64");
  const iv = Buffer.from(ivB64, "base64");
  const data = Buffer.from(ciphertextB64, "base64");

  const authTag = data.subarray(data.length - AUTH_TAG_LENGTH);
  const encrypted = data.subarray(0, data.length - AUTH_TAG_LENGTH);

  const key = deriveKey(userId, salt);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted) + decipher.final("utf8");
}
