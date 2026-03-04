import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Log in — just have a little meaning",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
