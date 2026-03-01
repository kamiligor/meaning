import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt } from "../encryption";

beforeAll(() => {
  process.env.APP_SECRET = "test-secret-key-for-encryption-tests-1234567890";
});

describe("encryption", () => {
  it("encrypts and decrypts a round trip", () => {
    const plaintext = "Teraz czuję się... spokojnie.";
    const userId = "user-123";

    const encrypted = encrypt(plaintext, userId);
    const decrypted = decrypt(
      encrypted.ciphertext,
      encrypted.iv,
      encrypted.salt,
      userId
    );

    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertext for same plaintext (random salt/iv)", () => {
    const plaintext = "test content";
    const userId = "user-123";

    const a = encrypt(plaintext, userId);
    const b = encrypt(plaintext, userId);

    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.iv).not.toBe(b.iv);
    expect(a.salt).not.toBe(b.salt);
  });

  it("different users produce different ciphertext", () => {
    const plaintext = "shared content";

    const a = encrypt(plaintext, "user-a");
    const b = encrypt(plaintext, "user-b");

    expect(a.ciphertext).not.toBe(b.ciphertext);
  });

  it("cannot decrypt with wrong user id", () => {
    const encrypted = encrypt("secret text", "user-correct");

    expect(() =>
      decrypt(encrypted.ciphertext, encrypted.iv, encrypted.salt, "user-wrong")
    ).toThrow();
  });

  it("detects tampered ciphertext", () => {
    const encrypted = encrypt("original text", "user-123");

    // Tamper with the ciphertext
    const buf = Buffer.from(encrypted.ciphertext, "base64");
    buf[0] ^= 0xff;
    const tampered = buf.toString("base64");

    expect(() =>
      decrypt(tampered, encrypted.iv, encrypted.salt, "user-123")
    ).toThrow();
  });

  it("handles empty string", () => {
    const encrypted = encrypt("", "user-123");
    const decrypted = decrypt(
      encrypted.ciphertext,
      encrypted.iv,
      encrypted.salt,
      "user-123"
    );
    expect(decrypted).toBe("");
  });

  it("handles unicode content", () => {
    const plaintext = "Cześć! Polskie znaki: ąćęłńóśźż. Emotikony: \u{1F60A}";
    const encrypted = encrypt(plaintext, "user-pl");
    const decrypted = decrypt(
      encrypted.ciphertext,
      encrypted.iv,
      encrypted.salt,
      "user-pl"
    );
    expect(decrypted).toBe(plaintext);
  });

  it("returns base64 encoded values", () => {
    const encrypted = encrypt("test", "user-123");
    expect(() => Buffer.from(encrypted.ciphertext, "base64")).not.toThrow();
    expect(() => Buffer.from(encrypted.iv, "base64")).not.toThrow();
    expect(() => Buffer.from(encrypted.salt, "base64")).not.toThrow();
  });
});
