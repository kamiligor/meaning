"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F4F6]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-[#1E2A36]">
            just have a little meaning
          </h1>
          <p className="text-sm text-[#8A99A8] mt-2 tracking-widest uppercase">
            Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm"
        >
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-[#8A99A8] tracking-wider uppercase mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#e8f0eb] rounded-lg text-[#1E2A36] focus:outline-none focus:border-[#7B9E8C] focus:ring-1 focus:ring-[#7B9E8C] transition"
            placeholder="Enter admin password"
            autoFocus
          />

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full mt-4 py-3 bg-[#7B9E8C] text-white font-semibold rounded-lg hover:bg-[#6a8d7b] transition disabled:opacity-50 disabled:cursor-not-allowed tracking-wider text-sm uppercase"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
