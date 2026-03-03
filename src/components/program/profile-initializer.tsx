"use client";

import { useEffect } from "react";

export function ProfileInitializer() {
  useEffect(() => {
    const stored = sessionStorage.getItem("onboarding_gender_form");
    if (!stored) return;

    sessionStorage.removeItem("onboarding_gender_form");

    // Update profile with the gender form chosen during onboarding (Google OAuth flow)
    fetch("/api/program/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender_form: stored }),
    }).catch(() => {
      // Best effort — user can change it later
    });
  }, []);

  return null;
}
