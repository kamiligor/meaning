"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/i18n";

type AuthMode = "login" | "register" | "lost-password";

interface AuthFormProps {
  mode: AuthMode;
  locale?: Locale;
  /** Use Link with replace for in-modal navigation */
  linkReplace?: boolean;
}

export function AuthForm({
  mode,
  locale = "en",
  linkReplace = false,
}: AuthFormProps) {
  const d = t(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/program/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        router.refresh();
        if (linkReplace) {
          router.back();
        } else {
          router.push(next);
        }
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          setError(d.authPasswordMismatch);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/program/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) {
          setError(error.message);
          return;
        }
        router.refresh();
        if (linkReplace) {
          router.back();
        } else {
          router.push(next);
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/program/auth/callback?next=/program/dashboard`,
        });
        if (error) {
          setError(error.message);
          return;
        }
        setResetSent(true);
      }
    } catch {
      setError(d.authGenericError);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/program/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  const title =
    mode === "login"
      ? d.authLoginTitle
      : mode === "register"
        ? d.authRegisterTitle
        : d.authLostPasswordTitle;

  if (mode === "lost-password" && resetSent) {
    return (
      <div className="w-full max-w-sm mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-[#1E2A36] text-center">
          {d.authLostPasswordTitle}
        </h1>
        <p className="text-sm text-[#4A5B6A] text-center">
          {d.authResetSent}
        </p>
        <div className="text-center">
          <Link
            href="/login"
            replace={linkReplace}
            className="text-sm text-[#7B9E8C] hover:underline"
          >
            {d.authBackToLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-[#1E2A36] text-center">
        {title}
      </h1>

      {/* Google OAuth */}
      {mode !== "lost-password" && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {d.authGoogleButton}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e8f0eb]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#8A99A8]">
                {d.authOrDivider}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="auth-email"
            className="text-sm font-medium text-[#1E2A36]"
          >
            {d.authEmail}
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-[#e8f0eb] bg-white px-3 py-2 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
            autoComplete="email"
          />
        </div>

        {mode !== "lost-password" && (
          <div className="space-y-2">
            <label
              htmlFor="auth-password"
              className="text-sm font-medium text-[#1E2A36]"
            >
              {d.authPassword}
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-[#e8f0eb] bg-white px-3 py-2 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
            />
          </div>
        )}

        {mode === "register" && (
          <div className="space-y-2">
            <label
              htmlFor="auth-confirm-password"
              className="text-sm font-medium text-[#1E2A36]"
            >
              {d.authConfirmPassword}
            </label>
            <input
              id="auth-confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-[#e8f0eb] bg-white px-3 py-2 text-sm text-[#1E2A36] placeholder:text-[#8A99A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] focus-visible:ring-offset-2"
              autoComplete="new-password"
              minLength={6}
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "..."
            : mode === "login"
              ? d.authLoginButton
              : mode === "register"
                ? d.authRegisterButton
                : d.authResetButton}
        </Button>
      </form>

      {/* Links */}
      <div className="text-center text-sm text-[#4A5B6A] space-y-2">
        {mode === "login" && (
          <>
            <div>
              <Link
                href="/lost-password"
                replace={linkReplace}
                className="text-[#7B9E8C] hover:underline"
              >
                {d.authForgotPassword}
              </Link>
            </div>
            <div>
              {d.authNoAccount}{" "}
              <Link
                href="/register"
                replace={linkReplace}
                className="text-[#7B9E8C] hover:underline font-medium"
              >
                {d.authRegisterLink}
              </Link>
            </div>
          </>
        )}
        {mode === "register" && (
          <div>
            {d.authHaveAccount}{" "}
            <Link
              href="/login"
              replace={linkReplace}
              className="text-[#7B9E8C] hover:underline font-medium"
            >
              {d.authLoginLink}
            </Link>
          </div>
        )}
        {mode === "lost-password" && (
          <div>
            <Link
              href="/login"
              replace={linkReplace}
              className="text-[#7B9E8C] hover:underline"
            >
              {d.authBackToLogin}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
