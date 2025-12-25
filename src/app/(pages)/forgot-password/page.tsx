"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? JSON.stringify(data));
      setMessage("If that email exists we sent reset instructions.");
    } catch (err: any) {
      setMessage(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <div className="text-sm">Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1 bg-slate-800 text-white rounded"
          >
            {loading ? "Sending..." : "Send reset email"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </form>

      {message && <div className="mt-4 text-sm">{message}</div>}
    </div>
  );
}
