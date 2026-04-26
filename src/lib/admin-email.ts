export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "";
}

export function isProgramAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}
