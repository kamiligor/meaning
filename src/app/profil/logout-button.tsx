"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function LogoutButton({ label = "Wyloguj się" }: { label?: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      onClick={handleLogout}
    >
      {label}
    </Button>
  );
}
