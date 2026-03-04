import { Suspense } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginModal() {
  return (
    <AuthModal title="Log in">
      <Suspense>
        <AuthForm mode="login" linkReplace />
      </Suspense>
    </AuthModal>
  );
}
