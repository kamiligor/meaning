import { Suspense } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthForm } from "@/components/auth/auth-form";

export default function LostPasswordModal() {
  return (
    <AuthModal title="Reset password">
      <Suspense>
        <AuthForm mode="lost-password" linkReplace />
      </Suspense>
    </AuthModal>
  );
}
