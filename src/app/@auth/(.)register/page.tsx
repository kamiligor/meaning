import { Suspense } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterModal() {
  return (
    <AuthModal title="Create account">
      <Suspense>
        <AuthForm mode="register" linkReplace />
      </Suspense>
    </AuthModal>
  );
}
